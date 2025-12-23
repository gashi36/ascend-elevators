// excel-download.service.ts
import { Injectable } from '@angular/core';
import { DownloadTenantExcelTemplateGQL } from '../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {
  constructor(
    private downloadTenantExcelTemplateGQL: DownloadTenantExcelTemplateGQL
  ) { }

  async downloadTenantTemplate(): Promise<void> {
    try {
      const result = await this.downloadTenantExcelTemplateGQL.mutate({}).toPromise();

      if (result?.data?.downloadTenantExcelTemplate?.success) {
        const template = result.data.downloadTenantExcelTemplate;
        this.downloadFile(template);
      } else {
        const errorMessage = result?.data?.downloadTenantExcelTemplate?.message || 'Failed to download template';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      throw error;
    }
  }

  private downloadFile(template: any): void {
    try {
      // Decode base64 file content
      const byteCharacters = atob(template.fileContent);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: template.contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.fileName || 'tenant-template.xlsx';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error creating download:', error);
      throw new Error('Failed to process file download');
    }
  }

  // Alternative method if your backend returns a URL
  downloadTemplateDirectly(): void {
    // If your backend returns a direct download URL
    const downloadUrl = '/api/templates/tenant-excel';
    window.open(downloadUrl, '_blank');
  }
}

// import { CommonModule } from '@angular/common';
// import { Component, OnInit, HostListener } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { UploadTenantsFromExcelGQL } from '../../../graphql/generated/graphql';
// import { FormsModule } from '@angular/forms';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';
// import { ExcelDownloadService } from '../excel-service.service';

// @Component({
//   selector: 'app-superadmin-panel',
//   templateUrl: './superadmin-panel.component.html',
//   imports: [RouterModule, CommonModule, FormsModule],
//   styleUrls: ['./superadmin-panel.component.scss'],
//   standalone: true,
// })
// export class SuperadminPanelComponent implements OnInit {

//   isSidebarOpen = true;
//   isProfileOpen = false;
//   isMobile = false;

//   // File download properties
//   isDownloadingTemplate = false;
//   downloadError: string | null = null;
//   downloadSuccess: string | null = null;

//   // File upload properties
//   selectedFile: File | null = null;
//   isUploading = false;
//   uploadError: string | null = null;
//   uploadSuccess: string | null = null;
//   uploadResult: any = null;

//   constructor(
//     private router: Router,
//     private uploadTenantsFromExcelGQL: UploadTenantsFromExcelGQL,
//     private excelDownloadService: ExcelDownloadService
//   ) { }

//   ngOnInit() {
//     this.checkScreenSize();
//   }

//   @HostListener('window:resize')
//   checkScreenSize() {
//     this.isMobile = window.innerWidth < 1024;
//     if (this.isMobile) this.isSidebarOpen = false;
//   }

//   toggleSidebar() {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }

//   toggleProfile() {
//     this.isProfileOpen = !this.isProfileOpen;
//   }

//   // ==================== FILE UPLOAD METHODS ====================

//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
//     if (file) {
//       // Validate file type
//       const validExtensions = ['.xlsx', '.xls'];
//       const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

//       if (!validExtensions.includes(fileExtension)) {
//         this.uploadError = 'Please select an Excel file (.xlsx or .xls)';
//         this.selectedFile = null;
//         event.target.value = '';
//         return;
//       }

//       // Validate file size (5MB limit)
//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         this.uploadError = 'File size must be less than 5MB';
//         this.selectedFile = null;
//         event.target.value = '';
//         return;
//       }

//       this.selectedFile = file;
//       this.uploadError = null;
//       this.uploadSuccess = null;
//       this.uploadResult = null;
//     }
//   }

//   async uploadTenantsFromExcel(): Promise<void> {
//     if (!this.selectedFile) {
//       this.uploadError = 'Please select a file first';
//       return;
//     }

//     this.isUploading = true;
//     this.uploadError = null;
//     this.uploadSuccess = null;
//     this.uploadResult = null;

//     try {
//       // Convert file to base64
//       const fileContent = await this.fileToBase64(this.selectedFile);

//       console.log('Uploading file:', {
//         fileName: this.selectedFile.name,
//         size: this.selectedFile.size,
//         type: this.selectedFile.type
//       });

//       // Try different mutation formats to find the correct one
//       let result;

//       // Option 1: Try with 'fileContent' property
//       try {
//         result = await this.uploadTenantsFromExcelGQL.mutate({
//           input: {
//             fileContent: fileContent,
//             fileName: this.selectedFile.name
//           }
//         }).pipe(
//           catchError((error) => {
//             console.log('Option 1 failed, trying option 2...');
//             return this.tryAlternativeMutation(fileContent);
//           })
//         ).toPromise();
//       } catch (error) {
//         result = await this.tryAlternativeMutation(fileContent).toPromise();
//       }

//       this.handleUploadResponse(result);

//     } catch (error: any) {
//       console.error('Error uploading file:', error);
//       this.uploadError = this.extractErrorMessage(error) || 'Failed to upload file. Please try again.';
//     } finally {
//       this.isUploading = false;

//       // Clear messages after 8 seconds
//       setTimeout(() => {
//         this.uploadError = null;
//         this.uploadSuccess = null;
//       }, 8000);
//     }
//   }

//   private tryAlternativeMutation(fileContent: string) {
//     // Option 2: Try with 'file' property instead of 'fileContent'
//     return this.uploadTenantsFromExcelGQL.mutate({
//       input: {
//         fileContent: fileContent,
//         fileName: this.selectedFile!.name
//       }
//     }).pipe(
//       catchError((error) => {
//         console.log('Option 2 failed, trying option 3...');
//         // Option 3: Try without input wrapper
//         return this.uploadTenantsFromExcelGQL.mutate({
//           fileContent: fileContent,
//           fileName: this.selectedFile!.name
//         } as any);
//       })
//     );
//   }

//   private handleUploadResponse(result: any): void {
//     if (result?.data?.uploadTenantsFromExcel) {
//       const response = result.data.uploadTenantsFromExcel;
//       this.uploadResult = response;

//       if (response.success) {
//         this.uploadSuccess = response.message || 'File uploaded successfully!';
//         this.resetUploadForm();
//       } else {
//         this.uploadError = response.message || 'Upload failed.';

//         if (response.errors && response.errors.length > 0) {
//           this.uploadError += ` (${response.errors.length} error${response.errors.length > 1 ? 's' : ''} found)`;
//         }
//       }
//     } else {
//       this.uploadError = 'No valid response received from server';
//     }
//   }

//   private extractErrorMessage(error: any): string {
//     console.log('Error details:', error);

//     if (error.graphQLErrors && error.graphQLErrors.length > 0) {
//       return error.graphQLErrors[0].message;
//     }

//     if (error.networkError) {
//       if (error.networkError.error?.errors) {
//         return error.networkError.error.errors[0]?.message || 'Network error';
//       }
//       return 'Network error. Please check your connection.';
//     }

//     if (error.message) {
//       return error.message;
//     }

//     return 'An unexpected error occurred';
//   }

//   private fileToBase64(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = (reader.result as string).split(',')[1];
//         resolve(base64String);
//       };
//       reader.onerror = (error) => {
//         reject(new Error('Failed to read file'));
//       };
//       reader.readAsDataURL(file);
//     });
//   }

//   resetUploadForm(): void {
//     this.selectedFile = null;
//     this.uploadResult = null;

//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   getUploadStats(): string {
//     if (!this.uploadResult) return '';

//     const stats = [];
//     const result = this.uploadResult;

//     if (result.totalRecords !== undefined) {
//       stats.push(`Records: ${result.totalRecords}`);
//     }
//     if (result.createdTenants !== undefined) {
//       stats.push(`Tenants: ${result.createdTenants}`);
//     }
//     if (result.createdBuildings !== undefined) {
//       stats.push(`Buildings: ${result.createdBuildings}`);
//     }
//     if (result.createdEntries !== undefined) {
//       stats.push(`Entries: ${result.createdEntries}`);
//     }

//     return stats.join(' | ');
//   }

//   // ==================== FILE DOWNLOAD METHODS ====================

//   async downloadTenantExcelTemplate(): Promise<void> {
//     this.isDownloadingTemplate = true;
//     this.downloadError = null;
//     this.downloadSuccess = null;

//     try {
//       await this.excelDownloadService.downloadTenantTemplate();
//       this.downloadSuccess = 'Excel template downloaded successfully!';
//     } catch (error: any) {
//       console.error('Error downloading template:', error);
//       this.downloadError = error.message || 'Failed to download template';
//     } finally {
//       this.isDownloadingTemplate = false;

//       // Clear messages after 5 seconds
//       setTimeout(() => {
//         this.downloadError = null;
//         this.downloadSuccess = null;
//       }, 5000);
//     }
//   }

//   // ==================== UTILITY METHODS ====================

//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';

//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));

//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   clearMessages(): void {
//     this.uploadError = null;
//     this.uploadSuccess = null;
//     this.downloadError = null;
//     this.downloadSuccess = null;
//   }
// }

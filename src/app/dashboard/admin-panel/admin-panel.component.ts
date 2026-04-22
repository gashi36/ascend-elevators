import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, AuthUser } from '../../funcServices/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ExportAllEntriesToZipGQL, ExportAllEntriesToZipMutation } from '../../../graphql/generated/graphql';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, FormsModule],
  templateUrl: './admin-panel.component.html',
  providers: [ExportAllEntriesToZipGQL]
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  currentUser: AuthUser | null = null;
  isMobileMenuOpen = false;

  // ─── Export ────────────────────────────────────────────────────────────────

  isExportDropdownOpen = false;
  isExporting = false;
  exportError: string | null = null;
  exportYear: number = new Date().getFullYear();

  readonly availableYears: number[] = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    public readonly authService: AuthService,
    private readonly exportZipGQL: ExportAllEntriesToZipGQL,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Mobile Menu ───────────────────────────────────────────────────────────

  toggleMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMenu(): void { this.isMobileMenuOpen = false; }

  // ─── Export ────────────────────────────────────────────────────────────────

  toggleExportDropdown(): void {
    this.isExportDropdownOpen = !this.isExportDropdownOpen;
    if (!this.isExportDropdownOpen) this.exportError = null;
  }

  closeExportDropdown(): void {
    this.isExportDropdownOpen = false;
    this.exportError = null;
  }

  exportAllEntries(): void {
    if (this.isExporting) return;

    this.isExporting = true;
    this.exportError = null;

    this.exportZipGQL
      .mutate({ variables: { year: +this.exportYear } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.isExporting = false;
          const result = (data as ExportAllEntriesToZipMutation)?.exportAllEntriesToZip;
          if (result?.base64Zip && result?.fileName) {
            this.downloadBlob(result.base64Zip, result.fileName, 'application/zip');
            this.closeExportDropdown();
          }
        },
        error: (err: unknown) => {
          this.isExporting = false;
          this.exportError = this.parseError(err);
        }
      });
  }

  private downloadBlob(base64: string, fileName: string, mimeType: string): void {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  private parseError(err: unknown): string {
    if (err && typeof err === 'object') {
      return (err as any)?.graphQLErrors?.[0]?.message
        ?? (err as any)?.message
        ?? null;
    }
    return 'Eksportimi dështoi. Ju lutemi provoni përsëri.';
  }

  logout(): void {
    this.authService.logout();
  }
}

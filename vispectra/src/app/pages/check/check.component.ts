import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VispectraService } from '../../app/services/vispectra.service';

interface CheckRow {
  textDatabase: string;
  bestMatch?: string;
  pageNo?: number;
  statusText1: string;
  statusText2: string;
  textCondition: string;
  verify: string;
  textVerify: string;
}

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent {
  selectedFileName: string = '';
  selectedFile!: File;
  pdfSrc: SafeResourceUrl | null = null;

  dropdown1 = '3+';
  dropdown2 = 'UU_DOM';
  dropdown3 = '>278.75';
  dropdown4 = 'SPW';
  dropdown5 = 'None';

  tableData: CheckRow[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private vispectraService: VispectraService
  ) {}

  triggerFileInput() {
    const el = document.getElementById('inputFile') as HTMLElement | null;
    if (el) el.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.pdfSrc = null;
      }
    }
  }

  clearFile() {
    this.selectedFileName = '';
    this.pdfSrc = null;
    const input = document.getElementById('inputFile') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  onRun() {
    if (!this.selectedFile || !this.dropdown2) return;

    this.vispectraService.runTextCheck(this.selectedFile, this.dropdown2).subscribe({
      next: (res) => {
        this.tableData = res.results.map((r: any) => ({
          textDatabase: r.target_text,
          bestMatch: r.best_match,
          pageNo: r.page_no,
          statusText1: r.is_found ? '✔️ Found' : '❌ Not Found',
          statusText2: r.case_ok ? 'Case OK' : 'Case Error',
          textCondition: r.char_check_ok !== null ? (r.char_check_ok ? '✓ Size OK' : '✗ Too Small') : '-',
          verify: r.underline_ok ? '✓ Underline' : '-',
          textVerify: r.bold_ok ? '✓ Bold' : '-'
        }));
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onExportExcel() {
    // [optional future feature]
  }
}

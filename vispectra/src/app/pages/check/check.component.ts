import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface CheckRow {
  textDatabase: string;
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
  pdfSrc: SafeResourceUrl | null = null;

  dropdown1 = '3+';
  dropdown2 = 'UU_DOM';
  dropdown3 = '>278.75';
  dropdown4 = 'SPW';
  dropdown5 = 'None';

  tableData: CheckRow[] = [
    {
      textDatabase: 'Sample',
      statusText1: 'OK',
      statusText2: 'OK',
      textCondition: 'Pass',
      verify: 'Yes',
      textVerify: 'Passed'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  triggerFileInput() {
    const el = document.getElementById('inputFile') as HTMLElement | null;
    if (el) el.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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
    // Logic สำหรับ RUN
  }
  onExportExcel() {
    // Logic สำหรับ Export Excel
  }
}

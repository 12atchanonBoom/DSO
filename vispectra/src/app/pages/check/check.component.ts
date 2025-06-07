import { Component } from '@angular/core';
import { CheckService } from './check.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent {
  selectedFile: File | null = null;
  selectedFileName = '';
  pdfSrc: SafeResourceUrl | null = null;
  tableData: any[] = [];  // เก็บผลลัพธ์ที่ backend ส่งมา
  dropdown1 = '3+';
  dropdown2 = 'UU_DOM';
  dropdown3 = '>278.75';
  dropdown4 = 'SPW';
  dropdown5 = 'None';

  constructor(private checkService: CheckService, private sanitizer: DomSanitizer) {}

  triggerFileInput() {
    const fileInput = document.getElementById('inputFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name || '';
      this.loadPdfPreview();
      this.tableData = []; // เคลียร์ตารางผลเดิม
    }
  }

  loadPdfPreview() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(this.selectedFile);
  }

  clearFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.pdfSrc = null;
    this.tableData = [];
  }

  onRun() {
    if (!this.selectedFile) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }

    console.log('Uploading file:', this.selectedFile.name);

    this.checkService.uploadPdf(this.selectedFile).subscribe({
      next: (res) => {
        console.log('Response from backend:', res);

        // สมมุติ backend ส่งข้อมูลมาในรูปแบบ { data: [...] }
        if (res && Array.isArray(res.data)) {
          // แมปข้อมูลให้ตรงกับตาราง (ถ้าต้องการแก้ชื่อฟิลด์ให้เหมาะสม)
          this.tableData = res.data.map((item: any) => ({
            textDatabase: item.keyword || '',
            statusText1: item.found ? 'พบ' : 'ไม่พบ',
            statusText2: item.bold !== undefined ? (item.bold ? 'ตัวหนา' : 'ไม่ตัวหนา') : '',
            textCondition: item.size_mm ? `${item.size_mm} mm` : '',
            verify: item.page ? `หน้า ${item.page}` : '',
            textVerify: item.page ? `หน้า ${item.page}` : '',
          }));
        } else {
          this.tableData = [];
          alert('รูปแบบข้อมูลจาก backend ไม่ถูกต้อง');
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('เกิดข้อผิดพลาดในการตรวจสอบไฟล์');
      }
    });
  }

  onExportExcel() {
    alert('ฟีเจอร์ Export Excel ยังไม่ถูกพัฒนาครับ');
  }
}

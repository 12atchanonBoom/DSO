import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  data: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // ถ้าเอาข้อมูลจาก localStorage
    // const allHistory = JSON.parse(localStorage.getItem('history-list') || '[]');
    // this.data = allHistory.find((h: any) => String(h.id) === String(id));

    // หรือเอาจาก mockup (แนะนำ: สร้าง service จริง หรือ import data array จากไฟล์ก็ได้)
    const mockData = [
      {
        id: 1,
        fileName: 'ไฟล์ตรวจสอบ1.pdf',
        checkedAt: new Date('2024-05-28T08:00:00'),
        status: 'Passed',
        summary: 'ผ่านการตรวจสอบครบทุกข้อ',
        resultTable: [{ key: 'Text1', value: 'OK' }]
      },
      {
        id: 2,
        fileName: 'Report2024.pdf',
        checkedAt: new Date('2024-05-27T20:30:00'),
        status: 'Failed',
        summary: 'พบข้อความไม่ถูกต้อง',
        resultTable: [{ key: 'Text1', value: 'ผิด' }]
      }
    ];
    this.data = mockData.find((h: any) => String(h.id) === String(id));

    // ถ้าไม่เจอข้อมูล ให้ redirect กลับ
    if (!this.data) {
      this.router.navigate(['/check-history']);
    }
  }

  goBack() {
    this.router.navigate(['/check-history']);
  }
}

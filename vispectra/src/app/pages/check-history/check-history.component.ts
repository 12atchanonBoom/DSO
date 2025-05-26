import { Component } from '@angular/core';

interface HistoryItem {
  id: number; // เพิ่ม id!
  fileName: string;
  checkedAt: Date;
  status: string;
  details: any;
}

@Component({
  selector: 'app-check-history',
  templateUrl: './check-history.component.html',
  styleUrls: ['./check-history.component.scss']
})
export class CheckHistoryComponent {
  historyList: HistoryItem[] = [
    {
      id: 1,
      fileName: 'ไฟล์ตรวจสอบ1.pdf',
      checkedAt: new Date('2024-05-28T08:00:00'),
      status: 'Passed',
      details: {
        summary: 'ผ่านการตรวจสอบครบทุกข้อ',
        resultTable: [{ key: 'Text1', value: 'OK' }]
      }
    },
    {
      id: 2,
      fileName: 'Report2024.pdf',
      checkedAt: new Date('2024-05-27T20:30:00'),
      status: 'Failed',
      details: {
        summary: 'พบข้อความไม่ถูกต้อง',
        resultTable: [{ key: 'Text1', value: 'ผิด' }]
      }
    }
    // เพิ่ม mockup ข้อมูลได้ตามต้องการ
  ];
}

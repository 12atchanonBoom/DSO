import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usersCount = 0;
  textsCount = 0;
  symbolsCount = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    // ตรวจสอบว่ารันใน browser หรือไม่
    if (isPlatformBrowser(this.platformId)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const texts = JSON.parse(localStorage.getItem('edit-texts') || '[]');
      const symbols = JSON.parse(localStorage.getItem('symbols') || '[]');
      this.usersCount = users.length;
      this.textsCount = texts.length;
      this.symbolsCount = symbols.length;
    }
  }

  logout() {
    // เพิ่ม logic logout เช่น clear token ถ้ามี
    this.router.navigate(['/']);
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  usersCount = 0;
  textsCount = 0;
  symbolsCount = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const texts = JSON.parse(localStorage.getItem('edit-texts') || '[]');
      const symbols = JSON.parse(localStorage.getItem('symbols') || '[]');
      this.usersCount = users.length;
      this.textsCount = texts.length;
      this.symbolsCount = symbols.length;
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout() {
    // เพิ่ม logic logout เช่น clear token ถ้ามี
    this.router.navigate(['/']);
  }
}

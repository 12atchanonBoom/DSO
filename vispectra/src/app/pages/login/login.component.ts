import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // ✅ เพิ่ม SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;        // ✅ ควบคุมสถานะปุ่ม
  showPassword = false;     // ✅ Toggle password visibility

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.error = '';
    this.isLoading = true;

    // จำลอง delay เหมือนโหลดข้อมูลจริง
    setTimeout(() => {
      if (this.username === 'a' && this.password === '1') {
        Swal.fire({
          title: 'Welcome, Admin!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonColor: '#2196f3',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/dashboard']);
      } else if (this.username === 'u' && this.password === '1') {
        Swal.fire({
          title: 'Welcome!',
          text: 'User login success!',
          icon: 'success',
          confirmButtonColor: '#00bcd4',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/home']);
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid username or password.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }

      this.isLoading = false;
    }, 700);
  }
}

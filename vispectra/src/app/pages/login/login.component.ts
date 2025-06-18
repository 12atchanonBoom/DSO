import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { UserService } from '../../app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.error = '';
    this.isLoading = true;

    this.userService.login(this.username, this.password).subscribe({
      next: (res) => {
        const role = res?.user?.role;
        Swal.fire({
          title: 'Welcome!',
          text: `Login successful as ${role}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // ✅ route ไปตาม role
        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login error', err);
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid username or password.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
        this.isLoading = false;
      }
    });
  }
}

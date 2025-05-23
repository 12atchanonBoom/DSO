import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';   // <-- เพิ่มตรงนี้

interface UserItem {
  id: number;
  username: string;
  password: string;
  role?: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  users: UserItem[] = [];
  searchText = '';
  modalOpen = false;
  form: Partial<UserItem> = {};
  isEditMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('users');
      this.users = saved ? JSON.parse(saved) : [];
    }
  }

  saveUsers() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  openAddModal() {
    this.form = { username: '', password: '', role: 'user' };
    this.isEditMode = false;
    this.modalOpen = true;
  }

  openEditModal(user: UserItem) {
    this.form = { ...user };
    this.isEditMode = true;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  onSubmitUser() {
    if (this.isEditMode && this.form.id != null) {
      // Edit
      const idx = this.users.findIndex(u => u.id === this.form.id);
      if (idx > -1) {
        this.users[idx] = { ...(this.form as UserItem) };
      }
    } else {
      // Add
      const newUser: UserItem = {
        id: Date.now(),
        username: this.form.username || '',
        password: this.form.password || '',
        role: this.form.role || 'user',
      };
      this.users.push(newUser);
    }
    this.saveUsers();
    this.closeModal();

    Swal.fire({
      icon: 'success',
      title: this.isEditMode ? 'บันทึกข้อมูลแล้ว' : 'เพิ่มผู้ใช้ใหม่สำเร็จ',
      showConfirmButton: false,
      timer: 1200
    });
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'ต้องการลบผู้ใช้งานนี้หรือไม่?',
      text: 'หากลบแล้วจะไม่สามารถกู้คืนได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#bdbdbd'
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(u => u.id !== id);
        this.saveUsers();

        Swal.fire({
          icon: 'success',
          title: 'ลบผู้ใช้งานเรียบร้อยแล้ว',
          showConfirmButton: false,
          timer: 1200
        });
      }
    });
  }

  get filteredUsers() {
    if (!this.searchText) return this.users;
    return this.users.filter(u =>
      u.username.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}

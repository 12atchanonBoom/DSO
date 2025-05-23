import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

interface TextItem {
  id: number;
  content: string;
}

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
  styleUrls: ['./edit-text.component.scss']
})
export class EditTextComponent implements OnInit {
  texts: TextItem[] = [];
  searchKeyword = '';

  // Modal states
  modalOpen = false;
  modalText = '';
  editMode = false;
  editingItem: TextItem | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('edit-texts');
      this.texts = saved ? JSON.parse(saved) : [
        { id: 1, content: 'คำเตือน' },
        { id: 2, content: 'อันตราย!' },
        { id: 3, content: 'สำหรับเด็กอายุ 3 ปีขึ้นไป' },
      ];
    } else {
      this.texts = [
        { id: 1, content: 'คำเตือน' },
        { id: 2, content: 'อันตราย!' },
        { id: 3, content: 'สำหรับเด็กอายุ 3 ปีขึ้นไป' },
      ];
    }
  }

  get filteredTexts() {
    return this.texts.filter(t =>
      t.content.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  // เปิด Modal เพิ่มข้อความ
  openAddModal() {
    this.modalText = '';
    this.editMode = false;
    this.editingItem = null;
    this.modalOpen = true;
  }

  // เปิด Modal แก้ไขข้อความ
  openEditModal(text: TextItem) {
    this.modalText = text.content;
    this.editMode = true;
    this.editingItem = text;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.modalText = '';
    this.editingItem = null;
  }

  // กดบันทึกใน modal (เพิ่มหรือแก้ไข)
  onSubmitModal() {
    const trimmed = this.modalText.trim();
    if (!trimmed) return;

    if (this.editMode && this.editingItem) {
      // Edit
      this.editingItem.content = trimmed;
      this.saveToLocal();
      this.closeModal();

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      // Add
      const newText: TextItem = {
        id: Date.now(),
        content: trimmed
      };
      this.texts.push(newText);
      this.saveToLocal();
      this.closeModal();

      Swal.fire({
        icon: 'success',
        title: 'เพิ่มข้อความสำเร็จ',
        showConfirmButton: false,
        timer: 1100
      });
    }
  }

  deleteText(text: TextItem) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `ต้องการลบข้อความ: "${text.content}" หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.texts = this.texts.filter(t => t !== text);
        this.saveToLocal();
        Swal.fire('ลบแล้ว!', 'ข้อความถูกลบเรียบร้อย', 'success');
      }
    });
  }

  saveToLocal() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('edit-texts', JSON.stringify(this.texts));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

interface TextItem {
  id: number;
  content: string;
  description: string;
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
  modalDescription = '';
  editMode = false;
  editingItem: TextItem | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('edit-texts');
      this.texts = saved ? JSON.parse(saved) : [
        { id: 1, content: 'คำเตือน', description: 'ข้อความแจ้งเตือนทั่วไป' },
        { id: 2, content: 'อันตราย!', description: 'แสดงความอันตรายอย่างชัดเจน' },
        { id: 3, content: 'สำหรับเด็กอายุ 3 ปีขึ้นไป', description: 'แนะนำอายุที่เหมาะสม' },
      ];
    } else {
      this.texts = [
        { id: 1, content: 'คำเตือน', description: 'ข้อความแจ้งเตือนทั่วไป' },
        { id: 2, content: 'อันตราย!', description: 'แสดงความอันตรายอย่างชัดเจน' },
        { id: 3, content: 'สำหรับเด็กอายุ 3 ปีขึ้นไป', description: 'แนะนำอายุที่เหมาะสม' },
      ];
    }
  }

  get filteredTexts() {
    return this.texts.filter(t =>
      t.content.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      t.description.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  openAddModal() {
    this.modalText = '';
    this.modalDescription = '';
    this.editMode = false;
    this.editingItem = null;
    this.modalOpen = true;
  }

  openEditModal(text: TextItem) {
    this.modalText = text.content;
    this.modalDescription = text.description;
    this.editMode = true;
    this.editingItem = text;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.modalText = '';
    this.modalDescription = '';
    this.editingItem = null;
  }

  onSubmitModal() {
    const trimmed = this.modalText.trim();
    const trimmedDesc = this.modalDescription.trim();
    if (!trimmed) return;

    if (this.editMode && this.editingItem) {
      this.editingItem.content = trimmed;
      this.editingItem.description = trimmedDesc;
      this.saveToLocal();
      this.closeModal();

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      const newText: TextItem = {
        id: Date.now(),
        content: trimmed,
        description: trimmedDesc,
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

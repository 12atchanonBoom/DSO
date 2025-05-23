import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2'; // <-- เพิ่ม import นี้

interface SymbolItem {
  id: number;
  imageUrl: string;
  imageName: string;
  category: string;
}

@Component({
  selector: 'app-edit-symbol',
  templateUrl: './edit-symbol.component.html',
  styleUrls: ['./edit-symbol.component.scss'] 
})
export class EditSymbolComponent implements OnInit {
  symbols: SymbolItem[] = [];
  categories = ['A', 'B', 'C'];
  searchText = '';
  modalOpen = false;
  form: Partial<SymbolItem> = {};
  isEditMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('symbols');
      this.symbols = saved ? JSON.parse(saved) : [];
    }
  }

  saveSymbols() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('symbols', JSON.stringify(this.symbols));
    }
  }

  openAddModal() {
    this.form = { imageUrl: '', imageName: '', category: this.categories[0] };
    this.isEditMode = false;
    this.modalOpen = true;
  }

  openEditModal(symbol: SymbolItem) {
    this.form = { ...symbol };
    this.isEditMode = true;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitSymbol() {
    if (this.isEditMode && this.form.id != null) {
      // Edit
      const idx = this.symbols.findIndex(s => s.id === this.form.id);
      if (idx > -1) {
        this.symbols[idx] = { ...(this.form as SymbolItem) };
      }
    } else {
      // Add
      const newSymbol: SymbolItem = {
        id: Date.now(),
        imageUrl: this.form.imageUrl || '',
        imageName: this.form.imageName || '',
        category: this.form.category || this.categories[0],
      };
      this.symbols.push(newSymbol);
    }
    this.saveSymbols();
    this.closeModal();

    // SweetAlert2 แจ้งเตือนเมื่อเพิ่ม/แก้ไขสำเร็จ
    Swal.fire({
      icon: 'success',
      title: this.isEditMode ? 'บันทึกข้อมูลแล้ว' : 'เพิ่มสัญลักษณ์สำเร็จ',
      showConfirmButton: false,
      timer: 1200
    });
  }

  deleteSymbol(id: number) {
    Swal.fire({
      title: 'ต้องการลบสัญลักษณ์นี้หรือไม่?',
      text: 'หากลบแล้วจะไม่สามารถกู้คืนได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#bdbdbd'
    }).then((result) => {
      if (result.isConfirmed) {
        this.symbols = this.symbols.filter(s => s.id !== id);
        this.saveSymbols();

        Swal.fire({
          icon: 'success',
          title: 'ลบสัญลักษณ์เรียบร้อยแล้ว',
          showConfirmButton: false,
          timer: 1200
        });
      }
    });
  }

  get filteredSymbols() {
    if (!this.searchText) return this.symbols;
    return this.symbols.filter(s =>
      s.imageName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}


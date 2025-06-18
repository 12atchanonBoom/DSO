// 📁 src/app/services/vispectra.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VispectraService {
  private apiUrl = 'http://localhost:8000/run-check/';

  constructor(private http: HttpClient) {}

  runTextCheck(file: File, category: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return this.http.post(this.apiUrl, formData);
  }
}

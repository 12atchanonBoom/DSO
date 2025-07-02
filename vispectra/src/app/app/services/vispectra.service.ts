// 📁 src/app/services/vispectra.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VispectraService {
  private apiUrl = 'http://localhost:8000/run-check/';
  private textTargetApi = 'http://localhost:3000/api/target-texts-by-size';

  constructor(private http: HttpClient) {}

  runTextCheck(file: File, category: string, sizeFilter: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('size_filter', sizeFilter.toString());
    return this.http.post(this.apiUrl, formData);
  }

  getTextTargetsByCategoryAndSizeGroup(category: string, sizeGroupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.textTargetApi}?category=${category}&size_group=${sizeGroupId}`);
  }
}

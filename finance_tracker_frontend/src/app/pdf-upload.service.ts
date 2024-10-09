// pdf-upload.service.ts
// pdf-upload.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfUploadService {
  private uploadUrl = `${environment.apiUrl}/upload-pdf/`;

  constructor(private http: HttpClient) {}

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf_file', file, file.name);
    return this.http.post(this.uploadUrl, formData);
  }
}

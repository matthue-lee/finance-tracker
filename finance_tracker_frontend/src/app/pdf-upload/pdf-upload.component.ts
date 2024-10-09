import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf and other directives
import { HttpClient } from '@angular/common/http';  // Import HttpClient for HTTP requests

@Component({
  selector: 'app-pdf-upload',
  standalone: true,  // Standalone component
  imports: [CommonModule],  // Import CommonModule to use *ngIf
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css']
})
export class PdfUploadComponent {
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadSuccess = false;
    this.uploadError = false;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
  
      this.http.post('http://localhost:8000/api/upload-pdf/', formData).subscribe(
        (response) => {
          console.log('PDF uploaded successfully', response);
          this.uploadSuccess = true;
          this.uploadError = false;
        },
        (error) => {
          console.error('Error uploading PDF', error);
          this.uploadSuccess = false;
          this.uploadError = true;
        }
      );
    }
  }
}

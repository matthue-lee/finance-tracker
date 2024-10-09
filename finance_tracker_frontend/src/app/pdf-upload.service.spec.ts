import { TestBed } from '@angular/core/testing';

import { PdfUploadService } from './pdf-upload.service';

describe('PdfUploadService', () => {
  let service: PdfUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

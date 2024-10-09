# pdf_upload/models.py
from django.db import models

class PDFUpload(models.Model):
    file = models.FileField(upload_to='uploads/pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PDF uploaded at {self.uploaded_at}"

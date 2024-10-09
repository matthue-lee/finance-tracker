# pdf_upload/serializers.py
from rest_framework import serializers
from .models import PDFUpload

class PDFUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFUpload
        fields = ['file', 'uploaded_at']

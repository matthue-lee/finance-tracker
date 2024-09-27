from django.db import models

class PDFUpload(models.Model):
    file = models.FileField(upload_to='uploads/')  # Store files in the 'uploads/' directory
    uploaded_at = models.DateTimeField(auto_now_add=True)

from django.db import models

class Transaction(models.Model):
    date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, blank=True, null=True)  # Optional for categorization

    def __str__(self):
        return f"{self.date} - {self.description} - {self.amount}"

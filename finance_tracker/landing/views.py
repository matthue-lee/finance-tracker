import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import fitz  # PyMuPDF
import os
from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from .forms import PDFUploadForm
from django.conf import settings
from .utils import extract_text_from_pdf, parse_table  # Import the categorize function
from .models import Transaction  # Import your model
from django.contrib import messages




# Ensure required NLTK resources are downloaded
nltk_data_path = os.path.join(settings.BASE_DIR, 'nltk_data')
if not os.path.exists(nltk_data_path):
    os.makedirs(nltk_data_path)

nltk.data.path.append(nltk_data_path)  # Set NLTK data path
nltk.download('stopwords', download_dir=nltk_data_path)  # Download stopwords
nltk.download('punkt', download_dir=nltk_data_path)  # Download punkt tokenizer

# Load NLTK resources
nltk_stopwords = stopwords.words('english')


def index(request):
    return render(request, 'landing/index.html')


def upload_pdf(request):
    if request.method == 'POST':
        form = PDFUploadForm(request.POST, request.FILES)
        if form.is_valid():
            pdf_file = form.cleaned_data['pdf_file']
            fs = FileSystemStorage()
            filename = fs.save(pdf_file.name, pdf_file)
            uploaded_file_path = os.path.join(settings.MEDIA_ROOT, filename)

            # Extract text from the uploaded PDF
            extracted_text = extract_text_from_pdf(uploaded_file_path)

            # Parse the text to extract data into a dictionary
            parsed_data = parse_table(extracted_text)

            if not parsed_data:
                messages.error(request, 'No valid transactions were found in the PDF.')
                return render(request, 'landing/upload_pdf.html', {'form': form})

            # Save parsed data to the database
            for transaction_data in parsed_data:
                if all(key in transaction_data for key in ['date', 'description', 'amount']):
                    Transaction.objects.create(
                        date=transaction_data['date'],
                        description=transaction_data['description'],
                        amount=transaction_data['amount'],
                        category=transaction_data.get('category', None)
                    )

            messages.success(request, 'PDF uploaded and data extracted successfully!')
            return redirect('upload_success')

    else:
        form = PDFUploadForm()
    return render(request, 'landing/upload_pdf.html', {'form': form})


def upload_success(request):
    return render(request, 'landing/upload_success.html')

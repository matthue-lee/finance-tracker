# pdf_upload/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PDFUploadSerializer

class PDFUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PDFUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'PDF uploaded successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CSVFetchView(APIView):
    def get(self, request):
        # Define the path to the CSV file
        csv_file_path = os.path.join(settings.BASE_DIR, 'csv_files/transactions.csv')

        # Read and parse the CSV file
        transactions = []
        try:
            with open(csv_file_path, newline='') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    transactions.append({
                        'Date': row['Date'],
                        'Description': row['Description'],
                        'Amount': row['Amount'],
                        'Category': row['Category']
                    })
        except FileNotFoundError:
            return Response({"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(transactions, status=status.HTTP_200_OK)
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from google.cloud import language_v1
from decouple import config  # python-decouple for environment variables
from openai import OpenAI

# Set the Google Cloud credentials for the NLP API
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(settings.BASE_DIR, 'secrets/googlecloud.json')
client = OpenAI(
    api_key=config("OPENAI_API_KEY")
)

import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from openai import OpenAI
from decouple import config  # Assuming you're using python-decouple for environment variables

# Initialize OpenAI API
openai_api_key = config('OPENAI_API_KEY')
client = OpenAI(api_key=openai_api_key)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(settings.BASE_DIR, 'secrets/googlecloud.json')


class CSVCategoryView(APIView):
    def get(self, request):
        # Path to the CSV file stored locally
        csv_file_path = os.path.join(settings.BASE_DIR, 'csv_files/demo_transactions.csv')

        # Ensure that the file exists
        if not os.path.exists(csv_file_path):
            return Response({"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND)

        # Read the CSV file
        try:
            transactions, fieldnames = CSVHelper.read_csv(csv_file_path)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Add 'NewCategory' column if it doesn't exist
        if 'NewCategory' not in fieldnames:
            fieldnames.append('NewCategory')

        # Collect descriptions into a list
        descriptions = [row.get('Description', '') for row in transactions if not row.get('NewCategory')]

        # If there are descriptions to categorize, call OpenAI
        if descriptions:
            categories = self.categorize_transactions(descriptions)
            print("categories")
            # Update the transactions with new categories
            for i, row in enumerate(transactions):
                if not row.get('NewCategory'):
                    row['NewCategory'] = categories[i]  # Assign category from the OpenAI response

        # Write the updated transactions to the CSV
        try:
            CSVHelper.write_csv(csv_file_path, transactions, fieldnames)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return the modified transactions as JSON data
        return Response({"transactions": transactions, "message": "CSV categories updated"}, status=status.HTTP_200_OK)

    def categorize_transactions(self, descriptions):
        """Use OpenAI to categorize a list of transaction descriptions."""
        prompt = "Categorize the following transaction descriptions into one of the following categories: groceries, rent, utilities, entertainment, transport, misc. respond with a single word for each description with a space between each\n\n"
        
        # Create a prompt by concatenating the descriptions
        for description in descriptions:
            prompt += f"- {description}\n"

        # Make the API call
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You will classify transactions into categories."},
                          {"role": "user", "content": prompt}]
            )

            # Parse the categories from the response
            # Assuming the model returns a list of categories in its content
            result_text = response['choices'][0]['message']['content']
            categories = result_text.split('\n')  # Split by newlines, adjust this as needed
            print("got here")
            return [cat.strip() for cat in categories if cat.strip()]

        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return ['Uncategorized'] * len(descriptions)  # Default to 'Uncategorized' if there's an error


class CSVHelper:
    """Helper class for CSV reading and writing."""

    @staticmethod
    def read_csv(file_path):
        """Reads the CSV and returns a list of transactions and fieldnames."""
        transactions = []
        fieldnames = []
        try:
            with open(file_path, newline='') as csvfile:
                reader = csv.DictReader(csvfile)
                fieldnames = reader.fieldnames
                if not fieldnames:
                    raise ValueError("No fieldnames found in the CSV file.")
                for row in reader:
                    transactions.append(row)
        except Exception as e:
            raise IOError(f"Error reading CSV file: {e}")
        return transactions, fieldnames

    @staticmethod
    def write_csv(file_path, transactions, fieldnames):
        """Writes the updated transactions to the CSV file."""
        try:
            with open(file_path, 'w', newline='') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(transactions)
        except Exception as e:
            raise IOError(f"Error writing CSV file: {e}")


class CSVFetchView(APIView):
    def get(self, request):
        # Path to the CSV file stored locally on your backend
        csv_file_path = os.path.join(settings.BASE_DIR, 'csv_files/demo_transactions.csv')

        # Ensure that the file exists
        if not os.path.exists(csv_file_path):
            return Response({"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND)

        # Read the CSV file
        try:
            transactions, _ = CSVHelper.read_csv(csv_file_path)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return the fetched transactions
        return Response(transactions, status=status.HTTP_200_OK)

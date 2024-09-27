# your_app/utils.py
import re
import fitz  # PyMuPDF
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create an instance of the OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def categorize_transaction(transaction_details):
    prompt = f"Categorize the following transaction into one of the following categories, respond with onlh one word, [entertainment, travel, fixed costs, incomes, groceries]: {transaction_details}"
    
    try:
        response = client.chat.completions.create(  # Use the correct method to call the chat completion
            model="gpt-4",  # Specify the model, e.g., gpt-4
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=1,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format={
                "type": "text"
            }
        )

        # Correctly access the content of the first choice
        category = response.choices[0].message.content.strip()  # Use dot notation instead of subscripting
        return category

    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None  # or some default category
def parse_table(text):
    pattern = re.compile(
        r"(?P<date>\d{2}[A-Za-z]{3}\d{2})?\s*"  
        r"(?P<serial>\d{6})?\s*"               
        r"(?P<transaction_details>.*?)(?:\s+\(\w{3}\s+\d+\.\d{2}\s+@\s+\d+\.\d{5}\))?\s+"  
        r"(?P<withdrawals>\d+\.\d{2})?\s*"     
        r"(?P<deposits>\d+\.\d{2})?\s*"        
        r"(?P<balance>\d+\.\d{2})"             
    )

    matches = pattern.finditer(text)
    transactions = []
    last_date = None

    for match in matches:
        date = match.group("date")
        if date:
            last_date = date
        else:
            date = last_date

        transaction_details = match.group("transaction_details").strip()
        
        # Categorize the transaction
        category = categorize_transaction(transaction_details)

        transaction = {
            "date": date,
            "serial": match.group("serial"),
            "transaction_details": transaction_details,
            "withdrawals": match.group("withdrawals"),
            "deposits": match.group("deposits"),
            "balance": match.group("balance"),
            "category": category  # Add category to the dictionary
        }
        transactions.append(transaction)

    return transactions



def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text



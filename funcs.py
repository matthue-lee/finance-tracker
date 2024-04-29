from openai import OpenAI



def read_data(fp):
    import csv
    rows = []
    with open(fp, 'r') as file:
        csvreader = csv.reader(file)
        header = next(csvreader)
        for row in csvreader:
            rows.append(row)
    return(rows)


def disp_data(dict):
    headers = ['Date', 'Amount', 'Reference', 'Description', 'Particulars', 'Balance']
    income = [float(sublist[1]) for sublist in dict if float(sublist[1]) > 0.0]
    print (income)
    expenditures = [sublist for sublist in dict if float(sublist[1]) < 0.0]
    print(expenditures)


def categorise_expenses(data):
    client = OpenAI()
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
        {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
    ]
    )

    print(completion.choices[0].message)
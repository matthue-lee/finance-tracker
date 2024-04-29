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
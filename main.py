import csv

secret_key = "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"

import sys
import funcs
if sys.argv[0] == '0':
    fp = 'test_data.csv'
    transactions = funcs.read_data(fp)

    funcs.disp_data(transactions)
elif sys.argv[0] == '1':
    funcs.categorise_expenses('hi')
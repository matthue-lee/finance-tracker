import csv
import sys
import funcs
fp = sys.argv[1]
transactions = funcs.read_data(fp)
funcs.disp_data(transactions)

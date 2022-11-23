# In this assignment you will read through and parse a file with text and numbers.
# You will extractall the numbers in the file and compute the sum of the numbers.

import re

file = input("Enter file name: ")
try:
    openfile = open(file)
except:
    print("File cannot be opened:", file)
    exit()

Numbers = list()
for line in openfile:
    line = line.rstrip()
    Numbers = Numbers + re.findall('[0-9]+', line)

Sum = 0
for number in Numbers:
    Sum = Sum + int(number)

print(Sum)
# Write a program that prompts for a file name, then opens that file and reads through the file, 
# looking for lines of the form: X-DSPAM-Confidence: 0.8475
# Count these lines and extract the floating point values from each of the lines and compute the average of those values 
# and produce an output as shown below. Do not use the sum() function or a variable named sum in your solution.

# When you are testing below enter mbox-short.txt as the file name.

file = input("Enter file name: ")

try:
    openfile = open(file)
except:
    print("File cannot be opened:", file)
    exit()

count = 0
total = 0

for line in openfile:
    if line.startswith("X-DSPAM-Confidence:"):
        count = count + 1
        total = total + float(line[20:])

print("Average spam confidence:", total/count)

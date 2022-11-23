# Write a program to read through the mbox-short.txt and figure out the distribution by hour of the day 
# for each of the messages.You can pull the hour out from the 'From ' line by finding the time and then 
# splitting the string a second time using a colon. From stephen.marquard@uct.ac.za Sat Jan 5 09:14:16 2008
# Once you have accumulated the counts for each hour, print out the counts, sorted by hour as shown below.

file = input("Enter file name: ")

try:
    openfile = open(file)
except:
    print("File cannot be opened:", file)
    exit()

Hours = dict()
for line in openfile:
    if line.startswith("From "):
        word = line.split()
        Hours[word[5][:2]] = Hours.get(word[5][:2], 0) + 1

for hour, count in sorted(Hours.items()):
    print(hour, count)
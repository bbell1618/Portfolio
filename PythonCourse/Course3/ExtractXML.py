# In this assignment you will write a Python program somewhat similar to http://www.pythonlearn.com/code/geoxml.py. 
# The program will prompt for a URL, read the XML data from that URL using urllib and then 
# parse and extract the comment counts from the XML data, compute the sum of the numbers in the file. 
# We provide two files for this assignment. One is a sample file where we give you the sum for your testing 
# and the other is the actual data you need to process for the assignment.
# 
# Sample data: http://python-data.dr-chuck.net/comments_42.xml (Sum=2553)
# Actual data: http://python-data.dr-chuck.net/comments_353536.xml (Sum ends with 90)
# You do not need to save these files to your folder since your program will read the data directly from the URL. 
# Note: Each student will have a distinct data url for the assignment - so only use your own data url for analysis.

import urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET

url = input('Enter location: ')
print('Retrieving', url)
uh = urllib.request.urlopen(url)
data = uh.read()
print('Retrieved', len(data), 'characters')
tree = ET.fromstring(data)

counts = tree.findall('.//count')
sum = 0
for count in counts:
    sum = sum + int(count.text)

print('Count:', len(counts))
print('Sum:', sum)
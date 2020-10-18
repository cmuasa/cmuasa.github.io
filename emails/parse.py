
f = open("emails.txt", "r")
s = set()
for email in f:
    s.add(email)
f.close()
f = open("emails.txt", "w")
for email in s:
    f.write(email)
f.close()
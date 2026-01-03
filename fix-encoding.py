
import json

# Read the file
with open('products.json', 'rb') as f:
    content = f.read()

# Try to decode from UTF-16LE which PowerShell often uses
try:
    text = content.decode('utf-16')
except:
    text = content.decode('utf-8')

# parse and re-dump as clean UTF-8
data = json.loads(text)
with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Fixed encoding to UTF-8")

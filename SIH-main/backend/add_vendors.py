import requests

vendors = [
    {"name": "Acme Pharma", "email": "contact@acmepharma.com", "rating": 4.8, "latitude": 19.0760, "longitude": 72.8777}, # Mumbai
    {"name": "Global Meds", "email": "sales@globalmeds.com", "rating": 3.5, "latitude": 28.7041, "longitude": 77.1025}, # Delhi
    {"name": "HealthCorp", "email": "info@healthcorp.in", "rating": 4.9, "latitude": 12.9716, "longitude": 77.5946}, # Bangalore
    {"name": "MediSupply", "email": "support@medisupply.com", "rating": 2.1, "latitude": 17.3850, "longitude": 78.4867}, # Hyderabad
]

# Delete existing vendors
try:
    res = requests.get("http://127.0.0.1:8000/vendors/")
    for v in res.json():
        requests.delete(f"http://127.0.0.1:8000/vendors/{v['id']}")
    print("Deleted existing vendors")
except Exception as e:
    print(e)

# Add new vendors
for v in vendors:
    res = requests.post("http://127.0.0.1:8000/vendors/", json=v)
    print(res.json())

print("Added vendors successfully.")

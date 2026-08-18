import random
from datetime import date, timedelta
from app.database import SessionLocal
from app.models import Location, Inventory, Medicine

db = SessionLocal()

# Missing locations from the UI list
missing_hospitals = [
    "AIIMS New Delhi",
    "Safdarjung Hospital",
    "J.J. Hospital Mumbai",
    "Rajiv Gandhi Super Speciality",
    "State Civil Hospital"
]

try:
    # Get medicines to assign
    medicines = db.query(Medicine).all()

    for hosp_name in missing_hospitals:
        # Check if already exists
        loc = db.query(Location).filter(Location.name == hosp_name).first()
        if not loc:
            loc = Location(name=hosp_name)
            db.add(loc)
            db.commit()
            db.refresh(loc)
            
            # Add some inventory for this new location
            for med in medicines:
                if random.random() > 0.3: # 70% chance to have the medicine
                    qty = random.randint(10, 500) * 10
                    days_to_expiry = random.randint(-10, 300)
                    expiry = date.today() + timedelta(days=days_to_expiry)
                    
                    inv = Inventory(
                        medicine_id=med.id,
                        location_id=loc.id,
                        quantity=qty,
                        expiry_date=expiry
                    )
                    db.add(inv)
            db.commit()
            
    print("Added missing hospitals and inventory!")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Inventory

db = SessionLocal()

try:
    inventories = db.query(Inventory).all()
    for inv in inventories:
        inv.quantity = inv.quantity * 10
    db.commit()
    print("Quantities increased successfully.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()

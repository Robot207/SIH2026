from datetime import date

from app.database import Base, engine, SessionLocal
from app.models import Medicine, Location, Inventory


def seed_database():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:

        # ==========================================
        # MEDICINES
        # ==========================================

        medicines = {
            "Insulin Injection": Medicine(
                name="Insulin Injection",
                reorder_level=50,
                category="Injection"
            ),

            "IV Saline 500ml": Medicine(
                name="IV Saline 500ml",
                reorder_level=150,
                category="IV Fluid"
            ),

            "Cough Syrup": Medicine(
                name="Cough Syrup",
                reorder_level=100,
                category="Syrup"
            ),

            "ORS Sachets": Medicine(
                name="ORS Sachets",
                reorder_level=200,
                category="Oral Rehydration"
            ),

            "Amoxicillin 250mg": Medicine(
                name="Amoxicillin 250mg",
                reorder_level=300,
                category="Antibiotic"
            ),

            "Paracetamol 500mg": Medicine(
                name="Paracetamol 500mg",
                reorder_level=100,
                category="Painkiller"
            ),
        }

        db.add_all(medicines.values())
        db.flush()


        # ==========================================
        # LOCATIONS
        # ==========================================

        locations = {
            "Central Drug Warehouse": Location(
                name="Central Drug Warehouse"
            ),

            "District Hospital Nashik": Location(
                name="District Hospital Nashik"
            ),

            "City General Hospital": Location(
                name="City General Hospital"
            ),

            "Rural PHC Karjat": Location(
                name="Rural PHC Karjat"
            ),
        }

        db.add_all(locations.values())
        db.flush()


        # ==========================================
        # LOW STOCK
        # EXACT 12 ROWS FROM DASHBOARD
        # ==========================================

        low_stock_data = [

            ("District Hospital Nashik",
             "Insulin Injection",
             10),

            ("Rural PHC Karjat",
             "IV Saline 500ml",
             24),

            ("District Hospital Nashik",
             "IV Saline 500ml",
             26),

            ("City General Hospital",
             "Cough Syrup",
             30),

            ("Central Drug Warehouse",
             "Cough Syrup",
             40),

            ("District Hospital Nashik",
             "ORS Sachets",
             50),

            ("District Hospital Nashik",
             "Cough Syrup",
             64),

            ("District Hospital Nashik",
             "Amoxicillin 250mg",
             86),

            ("Central Drug Warehouse",
             "IV Saline 500ml",
             113),

            ("City General Hospital",
             "IV Saline 500ml",
             137),

            ("City General Hospital",
             "ORS Sachets",
             182),

            ("Central Drug Warehouse",
             "Amoxicillin 250mg",
             294),
        ]


        for location_name, medicine_name, quantity in low_stock_data:

            db.add(
                Inventory(
                    medicine_id=medicines[medicine_name].id,
                    location_id=locations[location_name].id,
                    quantity=quantity
                )
            )


        # ==========================================
        # EXPIRY DATA
        # EXACT 21 ROWS FROM DASHBOARD
        # ==========================================

        expiry_data = [

            ("Central Drug Warehouse",
             "IV Saline 500ml",
             75,
             date(2026, 6, 22)),

            ("District Hospital Nashik",
             "Insulin Injection",
             2,
             date(2026, 6, 22)),

            ("City General Hospital",
             "Cough Syrup",
             30,
             date(2026, 7, 2)),

            ("Rural PHC Karjat",
             "ORS Sachets",
             48,
             date(2026, 7, 3)),

            ("District Hospital Nashik",
             "Amoxicillin 250mg",
             86,
             date(2026, 7, 9)),

            ("Central Drug Warehouse",
             "Amoxicillin 250mg",
             294,
             date(2026, 7, 15)),

            ("District Hospital Nashik",
             "IV Saline 500ml",
             16,
             date(2026, 7, 28)),

            ("District Hospital Nashik",
             "Paracetamol 500mg",
             926,
             date(2026, 8, 1)),

            ("Rural PHC Karjat",
             "ORS Sachets",
             57,
             date(2026, 8, 2)),

            ("District Hospital Nashik",
             "IV Saline 500ml",
             10,
             date(2026, 8, 7)),

            ("Central Drug Warehouse",
             "IV Saline 500ml",
             38,
             date(2026, 9, 12)),

            ("City General Hospital",
             "ORS Sachets",
             143,
             date(2026, 9, 15)),

            ("Central Drug Warehouse",
             "Cough Syrup",
             40,
             date(2026, 10, 8)),

            ("District Hospital Nashik",
             "Cough Syrup",
             42,
             date(2026, 10, 31)),

            ("City General Hospital",
             "IV Saline 500ml",
             109,
             date(2026, 11, 3)),

            ("Central Drug Warehouse",
             "Paracetamol 500mg",
             224,
             date(2026, 11, 4)),

            ("District Hospital Nashik",
             "Cough Syrup",
             22,
             date(2026, 11, 9)),

            ("Rural PHC Karjat",
             "ORS Sachets",
             303,
             date(2026, 11, 10)),

            ("Rural PHC Karjat",
             "Insulin Injection",
             100,
             date(2026, 11, 22)),

            ("Central Drug Warehouse",
             "ORS Sachets",
             369,
             date(2026, 12, 13)),

            ("City General Hospital",
             "Paracetamol 500mg",
             920,
             date(2027, 1, 26)),
        ]


        for (
            location_name,
            medicine_name,
            quantity,
            expiry_date
        ) in expiry_data:

            db.add(
                Inventory(
                    medicine_id=medicines[medicine_name].id,
                    location_id=locations[location_name].id,
                    quantity=quantity,
                    expiry_date=expiry_date
                )
            )


        # ==========================================
        # HEALTHY STOCK
        #
        # Low stock = 1056
        # Expiry data = 3854
        #
        # Target = 7554
        #
        # Remaining healthy stock:
        # 7554 - 1056 - 3854 = 2644
        # ==========================================

        healthy_stock_data = [

            ("Central Drug Warehouse",
             "Paracetamol 500mg",
             500),

            ("District Hospital Nashik",
             "Paracetamol 500mg",
             400),

            ("City General Hospital",
             "Paracetamol 500mg",
             300),

            ("Rural PHC Karjat",
             "Paracetamol 500mg",
             250),

            ("Central Drug Warehouse",
             "Insulin Injection",
             300),

            ("City General Hospital",
             "Insulin Injection",
             250),

            ("Central Drug Warehouse",
             "Cough Syrup",
             250),

            ("Rural PHC Karjat",
             "Cough Syrup",
             200),

            ("District Hospital Nashik",
             "ORS Sachets",
             194),
        ]


        for (
            location_name,
            medicine_name,
            quantity
        ) in healthy_stock_data:

            db.add(
                Inventory(
                    medicine_id=medicines[medicine_name].id,
                    location_id=locations[location_name].id,
                    quantity=quantity
                )
            )


        db.commit()

        print("Database seeded successfully.")
        print("Total stock: 7554")
        print("Low stock records: 12")
        print("Expiry records: 21")


    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
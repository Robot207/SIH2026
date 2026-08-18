from sqlalchemy import Column, Integer, ForeignKey, Date

from app.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.id"),
        nullable=False
    )

    location_id = Column(
        Integer,
        ForeignKey("locations.id"),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=0
    )

    expiry_date = Column(Date, nullable=True)
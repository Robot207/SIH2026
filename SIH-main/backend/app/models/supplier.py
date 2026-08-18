from sqlalchemy import Column, Integer, String, Float

from app.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    rating = Column(
        Float,
        nullable=False,
        default=0.0
    )

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )
from sqlalchemy import Column, Integer, String

from app.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    reorder_level = Column(Integer, nullable=False)

    category = Column(String, nullable=True)
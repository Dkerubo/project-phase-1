from database import db
from sqlalchemy_serializer import serializer

class Customer(db.Model, serializer):
    #tablename
    __tablename__='customers'
    
    #columns
    #primary_key
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    
    
    #define the relationship
    order = db.relationship('order', back_populates='customer')
    
    
    # def __repr__(self):
    #     return super().__repr__()
    
    
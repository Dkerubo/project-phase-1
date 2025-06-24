from database import db
from sqlalchemy_serializer import SerializerMixin

class Order(db.Model, SerializerMixin):
    __tablename__='orders'
    
    serialize_rules = ('-customer',)
    
    #primary key
    id = db.Column(db.Integer, primary_key=True)
    
    id = db.Column(db.String)
    total_price = db.Column(db.string)
    
    #connect the table
    Customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    Customer = db.relationship('customer', back_populates='orders')
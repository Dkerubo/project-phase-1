from models import Customer
from database import db
from app import app
from faker import Faker

fake = Faker()

with app.app_context():
    # Delete existing customers
    db.session.query(Customer).delete()
    print('Seeding!!')

    # Create a list of fake customers
    customers = []
    for _ in range(11):
        customers.append(Customer(
            full_name=fake.name(),
            email=fake.email(),
            phone=fake.phone_number()
        ))

    # Add all customers to the database
    db.session.add_all(customers)
    
    orders = []
    for _ in range(11):
        orders.append(Customer(
            items = fake.company(),
           total_price = random.randint(500, 4000),
           customer_id = random.randint(1, 6)
        ))

    # Add all customers to the database
    db.session.add_all(orders)
    
    
    db.session.commit()

    print('Seeding complete!!')

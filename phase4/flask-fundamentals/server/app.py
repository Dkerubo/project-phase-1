from flask import Flask, make_response, jsonify
from database import db
from flask_migrate import Migrate
from models import Customer, orders  # Assuming the class is named Customer

# Initialize the Flask app
app = Flask(__name__)

# Configure the app with the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, to avoid warnings

# Initialize the migration object
migrate = Migrate(app, db)

# Initialize the database object
db.init_app(app)  # This is already handled by SQLAlchemy(app) initialization

# Define route for fetching a customer by ID
@app.route('/customer/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get(id)  # Correct query to get by ID
    if customer:
        response_body = customer.to_dict()  # Assuming 'to_dict()' method is defined in the Customer model
        status_code = 200
    else:
        response_body = {
            'error': f'Customer with id {id} not found'
        }
        status_code = 404  # Use 404 for "Not Found"

    return make_response(jsonify(response_body), status_code)

...
TODO

GET /customers

...

...
GET /customerOrders/<id>
...
@app.route('/customerOrders/<int:id>')
def customer_orders(id):
    orders = []
    
    for i in Order.query.filter(Order.customer_id).all():
        orders.append(i.to_dict())
        response_body ={
            
        }

if __name__ == '__main__':
    app.run(port=5555, debug=True)
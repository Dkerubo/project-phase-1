from flask import Flask

# Create the app instance
app = Flask(__name__)

@app.route('/')
def index():
    return '<p>Welcome to Flask fundamentals!</p>'

# Define /home route
@app.route('/home')
def home():
    return '<h1>This is my homepage</h1>'

# Define dynamic route to greet the user by name
@app.route('/<string:name>')
def greet(name):
    return f'<p>Hello, {name}!</p>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
    

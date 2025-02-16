from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import psutil
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///network_tool.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Create Database Tables
with app.app_context():
    db.create_all()

# In-memory storage for bandwidth data
bandwidth_data = []

security_data = []

# Routes
@app.route('/api/network', methods=['GET'])
def get_network_info():
    net_io = psutil.net_io_counters()
    return jsonify({
        'bytes_sent': net_io.bytes_sent,
        'bytes_recv': net_io.bytes_recv,
        'packets_sent': net_io.packets_sent,
        'packets_recv': net_io.packets_recv,
        'errin': net_io.errin,
        'errout': net_io.errout,
        'dropin': net_io.dropin,
        'dropout': net_io.dropout
    })

@app.route('/api/bandwidth', methods=['GET'])
def get_bandwidth_data():
    # Simulate historical bandwidth data
    net_io = psutil.net_io_counters()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    bandwidth_data.append({
        'timestamp': timestamp,
        'bytes_sent': net_io.bytes_sent,
        'bytes_recv': net_io.bytes_recv
    })

    # Return the last 10 entries (for demonstration)
    return jsonify(bandwidth_data[-10:])

@app.route('/api/security', methods=['GET'])
def get_security_data():
    # Simulate security events (e.g., suspicious logins, unauthorized access)
    events = [
        "Failed login attempt",
        "Unauthorized access attempt",
        "Suspicious IP detected",
        "Brute force attack detected"
    ]
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    event = random.choice(events)  # Simulate a random security event
    security_data.append({
        'timestamp': timestamp,
        'event': event,
        'severity': random.choice(['Low', 'Medium', 'High'])  # Simulate severity
    })

    # Return the last 10 entries (for demonstration)
    return jsonify(security_data[-10:])

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
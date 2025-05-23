from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)  # Ensure passwords are hashed
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    bookings = db.relationship('Bookings', backref='user', lazy=True)
    reviews = db.relationship('Reviews', backref='user', lazy=True)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False, default=0.0)
    showtimes = db.relationship('Showtimes', backref='movie', lazy=True)
    reviews = db.relationship('Reviews', backref='movie', lazy=True)

class Theatre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Text, nullable=False, default='[0, 0, 0, ..., 0]')
    showtimes = db.relationship('Showtimes', backref='theatre', lazy=True)

class Showtimes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    m_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    movie_id = db.Column(db.String(100))
    t_id = db.Column(db.Integer, db.ForeignKey('theatre.id'), nullable=False)
    theatre_id = db.Column(db.String(100))
    showtime = db.Column(db.DateTime, nullable=False)
    bookings = db.relationship('Bookings', backref='showtime', lazy=True)

class Bookings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    showtime_id = db.Column(db.Integer, db.ForeignKey('showtimes.id'), nullable=False)
    seats = db.Column(db.Text, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    review_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

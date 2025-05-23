import os
import mutagen
from mutagen import mp3, mp4, ogg
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4
from mutagen.ogg import OggFileType
from datetime import datetime
# from worker import *
# from tasks import *
import uuid
# audio=mutagen(file_name)
# audio.length()
import matplotlib.pyplot as plt
from io import BytesIO
from werkzeug.utils import secure_filename
from werkzeug.exceptions import HTTPException
from werkzeug.security import check_password_hash, generate_password_hash
from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, send_file, jsonify, send_from_directory
import json
# import flask_excel as excel
# from celery.result import AsyncResult
from modal import *  # importing from modal
from sqlalchemy import func
# from flask_mail import Message
# from flask_mail import Mail
# from cache import *
# # from mail import send_email
# from celery import shared_task
# import flask_excel as excel
# from flask_login import login_user,login_required, logout_user,current_user
# from celery.schedules import crontab
# from flask_security import Security,SQLAlchemyUserDatastore,auth_required, roles_required

#################################################################################################################################
app = Flask(__name__,static_folder='static')
# Database connection for using database values
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///ticket.sqlite3"
app.config['SECRET_KEY'] = 'mysecret'  # Admin session available
app.config['UPLOAD_FOLDER'] = 'static/uploads'

db.init_app(app)
#################################################################################################################################
genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War",
    "Western"
]

#################################################################################################################################


# Handle 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/<path:path>', methods=['GET'])
def serve_vue_app(path):
    # Serve the Vue.js app's index.html for all other routes
    return send_from_directory(app.static_folder, 'Main.html')

@app.route('/')
def index():
    # l=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    # print(len(l))
    return send_from_directory('static', 'Main.html')

@app.route('/api/getmovies', methods=["GET"])
def give_movies():
    theatre_name = request.args.get('theatre')
    movie_id = request.args.get('movie_id')

    if theatre_name:
        theatre = Theatre.query.filter_by(name=theatre_name).first()
        showtimes = Showtimes.query.filter_by(theatre_id=theatre.name).all()
        movie_ids = [showtime.movie_id for showtime in showtimes]
        movies = Movie.query.filter(Movie.title.in_(movie_ids)).all()
    elif movie_id:
        if(movie_id!=0):
            
            movie = Movie.query.filter_by(id=movie_id).first()
            showtimes = [{
                'id': showtime.id,
                'theatre_id': showtime.theatre_id,
                'showtime': showtime.showtime.isoformat()
            } for showtime in movie.showtimes]
            movies=[movie]
            return jsonify([{
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'release_date': p.release_date,
                'duration': p.duration,
                'genre': p.genre,
                'rating': p.rating,
                'showtimes': showtimes
            } for p in movies])
    else:
        movies = Movie.query.all()
    # Return the movies as a JSON response
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'release_date': p.release_date,
        'duration': p.duration,
        'genre': p.genre,
        'rating': p.rating
    } for p in movies])

@app.route('/api/postmovies', methods=['POST'])
def add_movie():
    print(request.form)
    title = request.form.get('title')
    description = request.form.get('description')
    release_date_str = request.form.get('release_date')
    duration = request.form.get('duration')
    genre_name = request.form.get('genre')

    release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
    if not title or not release_date or not duration or not genre_name:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    new_movie = Movie(
        title=title,
        description=description,
        release_date=release_date,
        duration=duration,
        genre=genre_name
    )
    db.session.add(new_movie)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Movie added successfully'})


@app.route('/api/edit_movie', methods=["POST"])
def edit_movie():
    id = request.form.get('id')
    title = request.form.get('title')
    description = request.form.get('description')
    release_date_str = request.form.get('release_date')
    duration = request.form.get('duration')
    genre_name = request.form.get('genre')

    release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
    if not title or not release_date or not duration or not genre_name:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    movie_detail = Movie.query.filter_by(id=id).first()
    movie_detail.title = title
    movie_detail.description = description
    movie_detail.release_date = release_date
    movie_detail.duration = duration
    movie_detail.genre = genre_name
    db.session.commit()

    return jsonify({'success': True})


@app.route('/api/delmovie', methods=["POST"])
def delete_movie():
    id = request.form.get('id')
    movie = Movie.query.filter_by(id=id).first()
    db.session.delete(movie)
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/gettheatres', methods=["GET"])
def give_theatres():
    theatre_name = request.args.get('theatre')
    if theatre_name :
        theatre_detail = Theatre.query.filter_by(name=theatre_name).first()
        return jsonify({
            'id': theatre_detail.id,
            'name': theatre_detail.name,
            'location': theatre_detail.location,
            'capacity': json.loads(theatre_detail.capacity)
        })
    else:

        theatres = Theatre.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'location': p.location,
            'capacity': json.loads(p.capacity)
        }for p in theatres])


@app.route('/api/posttheatres', methods=['POST'])
def add_theatres():
    name = request.form.get('name')
    location = request.form.get('location')
    # capacity = request.form.get('capacity')
    capacity=json.dumps([0] * 60) # 0 means available
    if not name or not location:
        return jsonify({'success': False, 'message': 'All Fields are required.'}), 400

    new_theatre = Theatre(
        name=name,
        location=location,
        capacity=capacity
    )
    db.session.add(new_theatre)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Theatres added successfully'})


@app.route('/api/deltheatre', methods=["POST"])
def delete_theatre():
    id = request.form.get('id')
    theatre = Theatre.query.filter_by(id=id).first()
    if (theatre):
        db.session.delete(theatre)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False})


@app.route('/api/edit_theatre', methods=["POST"])
def edit_theatre():
    id = request.form.get('id')
    name = request.form.get('name')
    location = request.form.get('location')
    theatre_detail = Theatre.query.filter_by(id=id).first()
    theatre_detail.id = id
    theatre_detail.name = name
    theatre_detail.location = location
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/getshowtimes', methods=["GET"])
def give_showtimes():
    showtimes = Showtimes.query.all()
    return jsonify([{
        'id': p.id,
        'movie_id': p.movie_id,
        'theatre_id': p.theatre_id,
        'showtime': p.showtime
    }for p in showtimes])

@app.route('/api/postshowtime', methods=['POST'])
def add_showtime():
    movie_id = request.form.get('movie_id')
    m_id=Movie.query.filter_by(title=movie_id).first()
    m_id=m_id.id
    theatre_id = request.form.get('theatre_id')
    t_id=Theatre.query.filter_by(name=theatre_id).first()
    t_id=t_id.id
    showtime_str = request.form.get('show_time')
    showtime = datetime.fromisoformat(showtime_str)
    if not movie_id or not theatre_id or not showtime:
        return jsonify({'success': False, 'message': 'All Fields are required.'}), 400

    showtime = Showtimes(
        m_id=m_id,
        movie_id=movie_id,
        t_id=t_id,
        theatre_id=theatre_id,
        showtime=showtime
    )
    db.session.add(showtime)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Showtime added successfully'})

@app.route('/api/delshowtime',methods=["POST"])
def delete_showtime():
    id = request.form.get('id')
    showtime = Showtimes.query.filter_by(id=id).first()
    if (showtime):
        db.session.delete(showtime)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False})


@app.route('/api/edit_showtime',methods=["POST"])
def edit_showtime():
    id = request.form.get('id')
    movie_id = request.form.get('movie_id')
    theatre_id = request.form.get('theatre_id')
    showtime_str = request.form.get('showtime')
    showtime = datetime.fromisoformat(showtime_str)
    showtime_detail = Showtimes.query.filter_by(id=id).first()
    showtime_detail.id = id
    showtime_detail.movie_id = movie_id
    showtime_detail.theatre_id = theatre_id
    showtime_detail.showtime = showtime
    db.session.commit()
    return jsonify({'success': True})


@app.route('/api/getbookings', methods=["GET"])
def give_bookings():
    bookings = Bookings.query.all()
    return jsonify([{
        'id': p.id,
        'user_id': p.user_id,
        'showtime_id': p.showtime_id,
        'seats': p.seats,
        'total_price': p.total_price,
        'booking_date': p.booking_date
    }for p in bookings])


#################################################################################################################################

@app.route('/api/rateMovie',methods=["POST"])
def Rate_movie():
    rate = request.form.get('val')
    uemail = request.form.get('uemail')

    upassword = request.form.get('upassword')
    user = User.query.filter_by(email=uemail,upassword=upassword).first()
    user_id = user.id
    movie_id = request.form.get('movie_id')
    t = datetime.utcnow()
    new_rating = Reviews(movie_id=movie_id,user_id=user_id,rating=rate,review_date=t)
    db.session.add(new_rating)
    db.session.commit()

@app.route('/api/bookMovie',methods=["POST"])
def BookMovie():
    uemail = request.form.get('uemail')
    upassword = request.form.get('upassword')
    showtime_time_str = request.form.get('showtime_time')
    showtime_date = datetime.fromisoformat(showtime_time_str)
    seat_no1 = request.form.get('seat_no1')
    theatre_name = request.form.get('theatre_name')
    theatre = Theatre.query.filter_by(name=theatre_name).first()
    seat_no2 = request.form.get('seat_no2')
    seat_no3 = request.form.get('seat_no3')
    seats=[]
    if(int(seat_no1)>0):
        seats.append(seat_no1)
    if(int(seat_no2)>0):
        seats.append(seat_no2)
    if(int(seat_no3)>0):
        seats.append(seat_no3)
    seats_json = json.dumps(seats)
    price = request.form.get('price')

    theatre_capacity = json.loads(theatre.capacity)
    for i in range(len(theatre_capacity)):
        if(i==(int(seat_no1)-1) or i==(int(seat_no2)-1) or i==(int(seat_no3)-1)):
            theatre_capacity[i]=1
    print(theatre_capacity)
    capacity = json.dumps(theatre_capacity)
    theatre.capacity = capacity
    db.session.commit()

    user = User.query.filter_by(email=uemail,password=upassword).first()
    showtime = Showtimes.query.filter_by(showtime=showtime_date).first()


    old_booking = Bookings.query.filter_by(user_id=user.id).first()
    if(old_booking):
        booked_seats = json.loads(old_booking.seats)
        
        if(int(seat_no1)>0):
            booked_seats.append(seat_no1)
        if(int(seat_no2)>0):
            booked_seats.append(seat_no2)
        if(int(seat_no3)>0):
            booked_seats.append(seat_no3)
        edited_booked_seats = json.dumps(booked_seats)
        
        old_booking.seats = edited_booked_seats
        db.session.commit()

        return jsonify({'success':True})
    new_booking = Bookings(user_id=user.id,showtime_id=showtime.id,seats=seats_json,total_price=price)

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'success':True})

#################################################################################################################################

@app.route('/api/admin/statistics')
def admin_stats():
    # Fetching statistics
    movies_length = len(Movie.query.all())
    theatres_length = len(Theatre.query.all())
    showtimes_length = len(Showtimes.query.all())
    users_length = len(User.query.all())
    total_bookings = len(Bookings.query.all())
    total_reviews = len(Reviews.query.all())

    # Additional statistics
    total_revenue = db.session.query(func.sum(Bookings.total_price)).scalar() or 0
    average_movie_rating = db.session.query(func.avg(Movie.rating)).scalar() or 0
    most_popular_movie = db.session.query(Movie.title).join(Bookings).group_by(Movie.title).order_by(func.count(Bookings.id).desc()).limit(1).scalar()
    user_activity = db.session.query(User.username, func.count(Bookings.id)).join(Bookings).group_by(User.username).all()
    movie_release_trends = db.session.query(func.strftime('%Y-%m', Movie.release_date)).group_by(func.strftime('%Y-%m', Movie.release_date)).order_by(func.strftime('%Y-%m', Movie.release_date)).all()

    # Generate chart URLs
    pie_chart_url = generate_pie_chart()
    top_movies_url = generate_top_movies_chart()
    booking_trend_url = generate_booking_trend_chart()
    release_trend_url = generate_release_trend_chart()

    return jsonify({
        'total_movies': movies_length,
        'total_theatres': theatres_length,
        'total_showtimes': showtimes_length,
        'total_users': users_length,
        'total_bookings': total_bookings,
        'total_reviews': total_reviews,
        'total_revenue': total_revenue,
        'average_movie_rating': average_movie_rating,
        'most_popular_movie': most_popular_movie,
        'user_activity': {username: count for username, count in user_activity},
        'movie_release_trends': {date: count for date, count in movie_release_trends},
        'pie_chart_url': pie_chart_url,
        'top_movies_url': top_movies_url,
        'booking_trend_url': booking_trend_url,
        'release_trend_url': release_trend_url
    })

def generate_pie_chart():
    # Example of generating a pie chart (Movie Genre Distribution)
    genres = [movie.genre for movie in Movie.query.all()]
    genre_count = {genre: genres.count(genre) for genre in set(genres)}

    plt.pie(genre_count.values(), labels=genre_count.keys(), autopct='%1.1f%%')
    plt.title('Distribution of Movie Genres')

    # Save chart and return URL
    filename = f'{uuid.uuid4()}.png'
    filepath = os.path.join('static/charts', filename)
    plt.savefig(filepath)
    plt.close()

    return f'/static/charts/{filename}'

def generate_top_movies_chart():
    # Example of generating a bar chart (Top Rated Movies)
    movies = Movie.query.order_by(Movie.rating.desc()).limit(5).all()
    titles = [movie.title for movie in movies]
    ratings = [movie.rating for movie in movies]

    plt.bar(titles, ratings)
    plt.xlabel('Movie')
    plt.ylabel('Rating')
    plt.title('Top 5 Rated Movies')

    # Save chart and return URL
    filename = f'{uuid.uuid4()}.png'
    filepath = os.path.join('static/charts', filename)
    plt.savefig(filepath)
    plt.close()

    return f'/static/charts/{filename}'

def generate_booking_trend_chart():
    # Example of generating a line chart (Booking Trend over Time)
    booking_dates = [booking.booking_date.date() for booking in Bookings.query.all()]
    booking_count_by_date = {date: booking_dates.count(date) for date in set(booking_dates)}

    plt.plot(list(booking_count_by_date.keys()), list(booking_count_by_date.values()))
    plt.xlabel('Date')
    plt.ylabel('Total Bookings')
    plt.title('Booking Trend Over Time')

    # Save chart and return URL
    filename = f'{uuid.uuid4()}.png'
    filepath = os.path.join('static/charts', filename)
    plt.savefig(filepath)
    plt.close()

    return f'/static/charts/{filename}'

def generate_release_trend_chart():
    # Example of generating a bar chart (Movie Release Trends)
    release_dates = [date for date, _ in Movie.query.with_entities(func.strftime('%Y-%m', Movie.release_date)).group_by(func.strftime('%Y-%m', Movie.release_date)).all()]
    release_counts = [count for _, count in Movie.query.with_entities(func.strftime('%Y-%m', Movie.release_date), func.count(Movie.id)).group_by(func.strftime('%Y-%m', Movie.release_date)).order_by(func.strftime('%Y-%m', Movie.release_date)).all()]

    plt.bar(release_dates, release_counts)
    plt.xlabel('Month-Year')
    plt.ylabel('Number of Releases')
    plt.title('Movie Releases Over Time')

    # Save chart and return URL
    filename = f'{uuid.uuid4()}.png'
    filepath = os.path.join('static/charts', filename)
    plt.savefig(filepath)
    plt.close()

    return f'/static/charts/{filename}'

#################################################################################################################################

@app.route('/api/postusers',methods=["POST"])
def signup():
    username = request.form.get('username')
    email = request.form.get('uemail')
    password = request.form.get('upassword')
    
    new_user = User(username=username,email=email,password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'success': True})

@app.route('/api/getusers',methods=["GET"])
def give_users():
    users = User.query.all()
    return jsonify([{
        'id': p.id,
        'username': p.username,
        'email': p.email,
        'password': p.password
    }for p in users])

#################################################################################################################################

@app.route('/api/genre')
def apigenre():
    return jsonify([{
        'name': p
    } for p in genres])

#################################################################################################################################

if __name__ == "__main__":
    app.run(debug=True)

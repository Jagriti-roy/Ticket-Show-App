import pkg_resources
from app import *
from modal import *

with app.app_context():
    db.create_all()

    db.session.commit()

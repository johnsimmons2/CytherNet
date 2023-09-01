from sqlalchemy import String, Integer
from . import db


class Class(db.Model):
    __tablename__ = 'class'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String)
    description = db.Column(String)

    query = db.Query

class Subclass(db.Model):
    __tablename__ = 'subclass'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    classId = db.Column(Integer)
    name = db.Column(String)
    description = db.Column(String)

    query = db.Query
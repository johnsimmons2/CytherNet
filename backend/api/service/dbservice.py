import json
import hashlib
import api.service.jwthelper as jwth
from types import SimpleNamespace
from datetime import date
from uuid import uuid4
from api.model.user import *
from api.model.items import *
from api.model.character import *
from api.model.spellbook import *
from api.service.config import config
from api.loghandler.logger import Logger
from api.model import db
from sqlalchemy.orm import sessionmaker, Query


class AuthService:
    @classmethod
    def isAuthorized(cls, user: User, secret: str) -> User | None:
        # Request the auth-api project to see if a given user and secret combo
        pass

    @classmethod
    def register_user(cls, user: User):       
        nUser = User()
        nUser.salt = str(uuid4())
        nUser.password = cls._hash_password(user.password, nUser.salt)
        nUser.created = date.today()
        nUser.lastOnline = date.today()
        nUser.username = user.username
        nUser.email = user.email

        db.session.add(nUser)
        db.session.commit()
        return True
    
    @classmethod
    def _hash_password(cls, password: str, salt: str) -> str:
        secret = config('security')
        try:
            sha = hashlib.sha256()
            sha.update(password.encode(encoding = 'UTF-8', errors = 'strict'))
            sha.update(':'.encode(encoding = 'UTF-8'))
            sha.update(salt.encode(encoding = 'UTF-8', errors = 'strict'))
            sha.update(secret['usersecret'].encode(encoding = 'UTF-8', errors = 'strict'))
            return sha.hexdigest()
        except Exception as error:
            Logger.error(error)
        return None

    @classmethod
    def isAuthorized(cls, user: User, token: str) -> User | None:
        jwth.verify_token(token)

    @classmethod
    def authenticate_user(cls, user: User) -> User | None:
        query = Query(User, db.session)
        secret = user.password
        if user.username is not None:
            user = query.filter_by(username=user.username).first()
        elif user.email is not None:
            user = query.filter_by(email=user.email).first()
        else:
            Logger.error('Attempted to authenticate without email or username provided, or both were provided.')
            return None
        if not user:
            return None
        else:
            if AuthService._hash_password(secret, user.salt) == user.password:
                return jwth.create_token(user)
            else:
                return None

class UserService:
    query = Query(User, db.session)

    @classmethod
    def getAll(cls):
        return cls.query.all()

    @classmethod
    def get(cls, id: str):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def exists(cls, user: User):
        if user.username is not None:
            return cls.query.filter_by(username=user.username).first() is not None
        elif user.email is not None:
            return cls.query.filter_by(email=user.email).first() is not None
        else:
            return False

class SpellbookService:
    @classmethod
    def getAll(cls):
        return Spellbook.query.all()

    @classmethod
    def get(cls, id: str):
        return Spellbook.query.filter_by(id=id).first()

class CharacterService:
    @classmethod
    def getAll(cls):
        return Query(Character, db.session).all()
    
    @classmethod
    def getPlayerCharacters(cls):
        query = Query(Character, db.session)
        return query.filter_by(type=0).all()

    @classmethod
    def get(cls, id: str):
        return Query(Character, db.session).filter_by(id=id).first()

class ItemsService:
    @classmethod
    def getAll(cls):
        return Items.query.all()

    @classmethod
    def get(cls, id: str):
        return Items.query.filter_by(id=id).first()
    
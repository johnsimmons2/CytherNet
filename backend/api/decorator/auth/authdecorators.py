from api.service.jwthelper import get_access_token, verify_token, decode_token
from api.controller import UnAuthorized
from jwt.exceptions import InvalidSignatureError
from api.service.dbservice import UserService


def isAdmin(func):
    def wrapper(*arg, **kwargs):
        try:
            token = decode_token(get_access_token())
            isadmin = False
            if 'admin' in token.keys():
                isadmin = token['admin']
            if isadmin:
                return func(*arg, **kwargs)
            return UnAuthorized('The user does not have authorization for this route.')
        except InvalidSignatureError:
            return UnAuthorized('The token is not valid.')
    wrapper.__name__ = func.__name__
    return wrapper

def isAuthorized(func):
    def wrapper(*arg, **kwargs):
        tok = get_access_token()
        verified = verify_token(tok)
        if verified:
            return func(*arg, **kwargs)
        else:
            return UnAuthorized('The access token is invalid or expired.')
    wrapper.__name__ = func.__name__
    return wrapper

def userOwnsId(func):
    def wrapped(*arg, **kwargs):
        tok = decode_token(get_access_token())
        user = UserService.getByUsername(tok['username'])
        if 'id' in kwargs:
            if user.id == kwargs['id']:
                return func(*arg, **kwargs)
            else:
                return UnAuthorized('The current user does not have permission for this action')
    wrapped.__name__ = func.__name__
    return wrapped
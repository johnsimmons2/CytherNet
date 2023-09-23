import os
from flask import Flask
from flask_cors import CORS
from sqlalchemy.engine import URL
from api.loghandler.logger import Logger
from api.loghandler.formatted import FormattedLogHandler
from api.service.config import config, set_config_path
from api.controller.usercontroller import users
from api.controller.charactercontroller import characters
from api.model import db
from api.model.user import User
from api.service.dbservice import RoleService


# Setup logger
Logger.config_set_handler(FormattedLogHandler().set_color_dates(True))

# Create app
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Register routes

app.register_blueprint(users)
app.register_blueprint(characters)

CORS(app)
# Register db
set_config_path(os.path.dirname(os.path.realpath(__file__)))


dburl = os.getenv('DATABASE_URL')
if dburl is not None:
  app.config['SQLALCHEMY_DATABASE_URI'] = dburl
else:
  cfg = config()
  uri = URL.create(cfg['drivername'],
                  cfg['username'],
                  cfg['password'],
                  cfg['host'],
                  cfg['port'],
                  cfg['database'])
  app.config['SQLALCHEMY_DATABASE_URI'] = uri

db.init_app(app)

with app.app_context():
    db.create_all()
    db.session.commit()
    RoleService.initRoles()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

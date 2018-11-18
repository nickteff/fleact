from flask import Flask
from flask_cors import CORS

app = Flask(
    __name__,
    template_folder='../frontend/build/',
    static_folder='../frontend/build/static')

# enable CORS
CORS(app)

from backend import routes

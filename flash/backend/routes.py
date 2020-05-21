from backend import server
from frontend import app1

@server.route('/')
@server.route('/index')
def index():
    return 'Hello Flask app'

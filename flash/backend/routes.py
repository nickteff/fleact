from backend import server

@server.route('/')
@server.route('/index')
def index():
    return 'Hello Flask app'

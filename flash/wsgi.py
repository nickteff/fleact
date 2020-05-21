from backend import server
from frontend import app1
from frontend import app2

from waitress import serve


if __name__ == '__main__':
    app1.app.enable_dev_tools(debug=False)
    app2.app.enable_dev_tools(debug=False)
    serve(server, host='0.0.0.0', port=8080)



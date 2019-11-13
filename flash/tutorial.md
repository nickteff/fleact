# Embedding Dash within existing web applications
This section describes three different approaches to embedding a Dash app within an existing web application.

## Using an `<iframe>`
Perhaps the simplest approach to embedding Dash in an existing web
application is to an include an `<iframe>` element in your HTML whose `src` attribute points towards the address of an already running Dash instance. This allows you to place your Dash app in a specific location within an existing web page, with your desired dimensions:

```
<iframe src="http://localhost:8050" width=700 height=600>
```

## Embedding a Dash app within an existing Flask app

As discussed in the [Deployment Chapter](/deployment), Dash uses the Flask web framework under the hood. It is possible to take advantage of this and embed a Dash app at a specific route of an existing Flask app. In the following example, a Dash app is mounted at the `/dash` route (eg `http://localhost:8050/dash`) of a Flask app:

```
import flask
import dash
import dash_html_components as html

server = flask.Flask(__name__)
@server.route('/')
def index():
    return 'Hello Flask app'
app = dash.Dash(
    server=server,
    requests_pathname_prefix='/dash/',
    routes_pathname_prefix='/dash/',
)
app.layout = html.Div("My Dash app")
if __name__ == '__main__':
    app.run_server(debug=True)
```

## Embedding multiple Dash apps within an existing Flask app

If you want to combine multiple Dash apps with an existing Flask app, the following project layout can be used. Here, we create two distinct Dash apps, and use the Flask app defined in `server.py` as the server for both of them

`server.py`

```
from flask import Flask
server = Flask(__name__)
@server.route('/')
def index():
    return 'Hello Flask app'
```
`app1.py`
```
import dash
import dash_html_components as html
from server import server
app = dash.Dash(
    server=server,
    requests_pathname_prefix='/app1/',
    routes_pathname_prefix='/app1/',
)
app.layout = html.Div("Dash app 1")
```

`app2.py`
```
import dash
import dash_html_components as html
from server import server
app = dash.Dash(
    server=server,
    requests_pathname_prefix='/app2/',
    routes_pathname_prefix='/app2/',
)
app.layout = html.Div("Dash app 2")
```

`run.py`

```
from server import server
from app1 import app as app1
from app2 import app as app2
if __name__ == '__main__':
    app1.enable_dev_tools(debug=True)
    app2.enable_dev_tools(debug=True)
    server.run(port=8050, debug=True)
```

Since there are multiple Dash instances, we can't launch our app with `run_server`, so instead we use the `run` method of the Flask server, first calling `enable_dev_tools` for each Dash instance, as this is ordinarily called by `run_server`.
If you want to run this app using a WSGI server (while also having the ability to use dev tools such as hot-reloading), then the following `wsgi.py` can be used to run your app instead of `run.py`:

`wsgi.py`

```
from server import server
from app1 import app as app1
from app2 import app as app2
app1.enable_dev_tools(debug=True)
app2.enable_dev_tools(debug=True)
```

To launch this app with Gunicorn you would run this command (the `--reload` flag is required for hot reloading to work):
```
$ gunicorn --reload wsgi:server
```
> **Note:** debug mode should not be enabled in production. When deploying the above examples to production, you should set `debug=False` and not use the `--reload` flag for Gunicorn.

## Combining Dash apps with existing WSGI apps
This approach uses Werkzeug's [`DispatcherMiddleware`](http://werkzeug.pocoo.org/docs/latest/middlewares/)
to combine one or more Dash apps with one more existing WSGI apps. Unlike the previous approach, your existing web apps don't have to be built on Flask, but instead can be any Python web application implementing the [WSGI specification](https://wsgi.readthedocs.io).

The following example illustrates this approach. In this example, the existing app being combined with two Dash apps is a Flask app, however it could be [any WSGI app](https://wsgi.readthedocs.io/en/latest/frameworks.html).

`flask_app.py`

```
from flask import Flask
flask_app = Flask(__name__)
@flask_app.route('/')
def index():
    return 'Hello Flask app'
```

`app1.py`

```
import dash
import dash_html_components as html

app = dash.Dash(requests_pathname_prefix='/app1/')
app.layout = html.Div("Dash app 1")
```

`app2.py`
```
import dash
import dash_html_components as html

app = dash.Dash(requests_pathname_prefix='/app2/')
app.layout = html.Div("Dash app 2")
```

`wsgi.py`

```
from werkzeug.wsgi import DispatcherMiddleware
from app1 import app as app1
from app2 import app as app2
app1.enable_dev_tools(debug=True)
app2.enable_dev_tools(debug=True)

application = DispatcherMiddleware(flask_app, {
    '/app1': app1.server,
    '/app2': app2.server,
})
```

In this example, the Flask app has been mounted at `/` and the two Dash apps have been mounted at `/app1` and `/app2`. In this approach, we do not pass in a Flask server to the Dash apps, but let them create their own, which the `DispatcherMiddleware` routes requests to based on the prefix of the incoming requests. Within each Dash app, only `requests_pathname_prefix` must be provided with the app's mount point, as the mount points specified
in the `DispatcherMiddleware` initialization has effectively already set `requests_pathname_prefix` with the correct value.
Note that the `application` object in `wsgi.py` is of type
`werkzeug.wsgi.DispatcherMiddleware`, which does not have a `run`
method. This can be run as a WSGI app like so:
```
$ gunicorn --reload wsgi:application
```

> **Note:** debug mode should not be enabled in production. When deploying
> the above examples to production, you should set `debug=False` and not use
> the `--reload` flag for Gunicorn.

Alternatively, you can use the Werkzeug development server (which is not suitable for production) to run the app:

`wsgi.py`
```
from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple
from app1 import app as app1
from app2 import app as app2
app1.enable_dev_tools(debug=True)
app2.enable_dev_tools(debug=True)

application = DispatcherMiddleware(flask_app, {
    '/app1': app1.server,
    '/app2': app2.server,
})
if __name__ == '__main__':
    run_simple('localhost', 8050, application)
```

You would run the above with:
```
$ python wsgi.py
```

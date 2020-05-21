import dash
import dash_bootstrap_components as dbc
import dash_html_components as html
from backend import server

app = dash.Dash(
    __name__,
    server=server,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    #requests_pathname_prefix='/app2/',
    #routes_pathname_prefix='/app2/',
    url_base_pathname='/app2/'
)

app.layout = html.Div('hello')

import dash
import dash_html_components as html
from backend import server

app = dash.Dash(
    server=server,
    requests_pathname_prefix='/app2/',
    routes_pathname_prefix='/app2/',
    #url_base_pathname='/app2/'
)



app.layout = html.Div([
    html.Div(
        [html.Button('Hello')],
        className="six columns"
    ),
    html.Div(
        [html.Button('Dash')],
        className="six columns"
    )
],
    className="container"
)

app.css.append_css({"external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"})

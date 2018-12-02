from flask import render_template, jsonify, request
import pandas as pd
from plotly.graph_objs import *

from backend import app

accesstoken = 'pk.eyJ1IjoicGluZXlkYXRhIiwiYSI6ImNqb2t3NWN6ZDAycGkzcXAzODc2cml2bm8ifQ.aGKqMqIIKcLto1Lw9Ek89A'

df = pd.read_csv('compute/static/census.csv')
df.loc[:, "MSA_CODE"] = df.loc[:, "MSA_CODE"].astype('int')
tbl = pd.read_csv('compute/static/states.csv')

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/api/states')
def states():
    states = tbl.itertuples()
    states2 = tbl.itertuples()
    states = {
        'options': [
            {'label': state.State, 'value': state.StateCode }
                for state in states
        ],
    }

    return jsonify(states)



@app.route('/api/states/<state>')
def statesGeo(state):
    layout = {"layout": {
      'autosize': True,
      'hovermode':'closest',
      'mapbox': {
        'bearing':0,
        'center': {
          'lat':37,
          'lon':-95
        },
        'pitch':0,
        'zoom':int(15),
        'style':'streets'
      },
    }}
    return jsonify(layout)



@app.route('/api/chart/country')
def chartView():
    return jsonify(maply(df).to_plotly_json())

@app.route('/api/chart/state/<state>')
def chartStateView(state):
    return jsonify(maply(df[df.STATECODE == state], state).to_plotly_json())

@app.route('/api/chart/urban/<urban>')
def urbanView(urban):
    if urban == 'urban':
        return jsonify(maply(df[df.MSA_CODE != 0]).to_plotly_json())
    else:
        return jsonify(maply(df[df.MSA_CODE == 0]).to_plotly_json())

state="MN"
tbl.loc[tbl.StateCode == state, 'Lat'].values[0]

def maply(df, state=None):
    if state != None:
        lat = tbl.loc[tbl.StateCode == state, 'Lat'].values[0]
        lon = tbl.loc[tbl.StateCode == state, 'Lon'].values[0]
        zoom = int(tbl.loc[tbl.StateCode == state, 'Zoom'].values[0])
    else:
        lat = 38
        lon = -96
        zoom = 3.5
    data = [{
      'type':'scattermapbox',
      'lat':list(df.LAT),
      'lon':list(df.LON),
      'mode':'markers',
      'marker': {
        'size':6
      },
      'text':["{}, {}".format(city.CITY, city.STATECODE) for city in df.loc[:, ["CITY", "STATECODE"]].itertuples()],
    }]

    layout = {
      'autosize': True,
      'hovermode':'closest',
      'mapbox': {
        'accesstoken': accesstoken,
        'bearing':0,
        'center': {
          'lat':lat,
          'lon':lon
        },
        "pitch":0,
        'zoom':zoom,
        'style':'streets'
      },
      'margin': {
        'l': 1,
        'r': 1,
        'b': 1,
        't': 1,
        'pad': 4
      },
    }


    fig = Figure(data=data, layout=layout)

    return fig

maply(df[df.STATECODE=="MN"]).to_plotly_json()

def barChart(df, measure):

    data = [{
        'type': 'bar',
        'x': list(df.measure.unique()),
        'y': list(df.groupby(measure).mean())
    }]



# import plotly.plotly as py
# from plotly.graph_objs import *
# from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
#
#
# trace1 = {
#   "x": [20, 14, 23],
#   "y": ["giraffes", "orangutans", "monkeys"],
#   "marker": {
#     "color": "rgba(55, 128, 191, 0.6)",
#     "line": {
#       "color": "rgba(55, 128, 191, 1.0)",
#       "width": 1
#     }
#   },
#   "name": "SF Zoo",
#   "orientation": "h",
#   "type": "bar"
# }
# trace2 = {
#   "x": [12, 18, 29],
#   "y": ["giraffes", "orangutans", "monkeys"],
#   "marker": {
#     "color": "rgba(255, 153, 51, 0.6)",
#     "line": {
#       "color": "rgba(255, 153, 51, 1.0)",
#       "width": 1
#     }
#   },
#   "name": "LA Zoo",
#   "orientation": "h",
#   "type": "bar"
# }
# data = Data([trace1, trace2])
# layout = {"barmode": "stack"}
# fig = Figure(data=data, layout=layout)
# fig.to_plotly_json()
#
# plot_url = plot(fig)

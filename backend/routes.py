from flask import render_template, jsonify, request
import pandas as pd

from backend import app


df = pd.read_csv('backend/static/census_msa_loc.csv')
tbl = pd.read_csv('backend/static/states.csv')

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
        'geo': [
            {'state': state.StateCode,
             'lat': state.Latitude,
             'lon': state.Longitude }
                for state in states2
        ]
    }
    return jsonify(states)

@app.route('/api/chart')
def chartView():
    return jsonify(maply(df))

@app.route('/api/chart/<state>')
def chartStateView(state):
    return jsonify(maply(df[df.STATECODE == state]))

def maply(df):
    data = [{
      'type':'scattermapbox',
      'lat':list(df.LONG_Y),
      'lon':list(df.LAT_X),
      'mode':'markers',
      'marker': {
        'size':4
      },
      'text':["{}, {}".format(city.CITY, city.STATECODE) for city in df.loc[:, ["CITY", "STATECODE"]].itertuples()],
    }]

    fig = dict(data=data)

    return fig

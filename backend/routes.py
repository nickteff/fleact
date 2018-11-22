from flask import render_template, jsonify, request
import pandas as pd

from backend import app


df = pd.read_csv('backend/static/census.csv')
#df.iloc[:, 6:] = df.iloc[:, 6:].astype('float')
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
    return jsonify(maply(df))

@app.route('/api/chart/<state>')
def chartStateView(state):
    return jsonify(maply(df[df.STATECODE == state]))



def maply(df):
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

    fig = dict(data=data)

    return fig

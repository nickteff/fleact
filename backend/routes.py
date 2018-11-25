from flask import render_template, jsonify, request
import pandas as pd

from backend import app


df = pd.read_csv('compute/static/census.csv')
df.loc[:, "MSA_CODE"] = df.loc[:, "MSA_CODE"].astype('int')
tbl = pd.read_csv('compute/static/states.csv')

#df[df.MSA_CODE != 0].sample(3)

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

@app.route('/api/chart/state/<state>')
def chartStateView(state):
    return jsonify(maply(df[df.STATECODE == state]))

@app.route('/api/chart/urban/<urban>')
def urbanView(urban):
    if urban == 'urban':
        return jsonify(maply(df[df.MSA_CODE != 0]))
    else:
        return jsonify(maply(df[df.MSA_CODE == 0]))



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

maply(df[df.MSA_CODE == 0])

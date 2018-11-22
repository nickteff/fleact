import React, { Component } from 'react';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import axios from 'axios';


const AccessToken = 'pk.eyJ1IjoicGluZXlkYXRhIiwiYSI6ImNqb2t3NWN6ZDAycGkzcXAzODc2cml2bm8ifQ.aGKqMqIIKcLto1Lw9Ek89A'

const layout = {
  autosize: true,
  hovermode:'closest',
  mapbox: {
    bearing:0,
    center: {
      lat:37,
      lon:-95
    },
    pitch:0,
    zoom:3.5,
    style:'streets'
  },
}

const spec = 'api/chart';
const states = '/api/states'

class Map extends Component {
  state = {
    selectValue: '',
    options: [],
    data: [],
    layout: layout,
  };

  componentDidMount() {
    axios.get(states)
      .then((res) => {
        this.setState({ options: res.data.options })
      })
      .catch((error) => {
        console.error(error);
      });

      axios.get(spec+'/country')
        .then((res) => {
          this.setState({ data: res.data.data })
        })
        .catch((error) => {
          console.error(error);
        });

  }

  onSelectChange = opt => {
    this.setState({
      selectValue: opt,
    })

    // this is still not quite working.  I want the layout to update
    // but having some issues getting it from the API
    axios.get(states+'/'+opt.value)
      .then((res) => {
        this.setState({layout: layout})  // try to change later

      return axios.get(spec+'/'+opt.value);
      })
      .then((res) => {
        this.setState({ data: res.data.data })

      })
      .catch((err) => {
        console.error(err)
      });

  };

  render() {
    return (
      <div className="App">
          <Select
            options={this.state.options}
            value={ this.state.selectValue }
            onChange={ this.onSelectChange }
            className='basic-single'>
          </Select>
          <div id="vis"></div>
          <Plot
            data={ this.state.data }
            layout={ this.state.layout }
            style={ {width: '1200px', height: '800px'} }
            useResizeHandler={ true }
            config={ {mapboxAccessToken: AccessToken} }>
          </Plot>
      </div>
    );
  }
}

export default Map;

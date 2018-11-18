import React, { Component } from 'react';
import Select from 'react-select';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './App.css';


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
    zoom:3.5
  },
}


const spec = 'api/chart';
const states = '/api/states'

class App extends Component {
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

      axios.get(spec)
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


    axios.get(spec+'/'+opt.value)
        .then((res) => {
          this.setState({ data: res.data.data})
        })
        .catch((error) => {
          console.errot(error);
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

export default App;

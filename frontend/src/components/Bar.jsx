import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';



class Bar extends Component {
    <Plot
        data={this.state.incomeData}
        layout={this.state.incomeLayout}
        style={
            {
                width: '100%',
                height: '200px',
            }
        }
        config={{ displayModeBar: false, }}
    >
    </Plot>
}


export default Bar;
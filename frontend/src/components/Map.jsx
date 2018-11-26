import React, { Component } from 'react';
import {Row, Col, Select, Layout} from 'antd';
import "antd/dist/antd.css";
//import Select from 'react-select';
import Plot from 'react-plotly.js';
import axios from 'axios';


const { Header, Content, Footer } = Layout;

const Option = Select.Option

const AccessToken = 'pk.eyJ1IjoicGluZXlkYXRhIiwiYSI6ImNqb2t3NWN6ZDAycGkzcXAzODc2cml2bm8ifQ.aGKqMqIIKcLto1Lw9Ek89A'

const layout = {
  autosize: true,
  hovermode:'closest',
  mapbox: {
    bearing:0,
    center: {
      lat:38,
      lon:-95
    },
    pitch:0,
    zoom:3.2,
    style:'streets'
  },
  margin: {
    l: 1,
    r: 1,
    b: 1,
    t: 1,
    pad: 4
  },
}

const spec = 'api/chart';
const states = '/api/states'

class Map extends Component {
  state = {
    selectUrbanValue: '',
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
      selectValue: opt.value,
    })
    console.log(opt)
    console.log(this.selectValue)

    // this is still not quite working.  I want the layout to update
    // but having some issues getting it from the API
    axios.get(states+'/'+opt)
      .then((res) => {
        this.setState({layout: layout})  // try to change later

      return axios.get(spec+'/state/'+opt);
      })
      .then((res) => {
        this.setState({ data: res.data.data })

      })
      .catch((err) => {
        console.error(err)
      });

  };

  onUrbanSelectChange = opt => {
    this.setState({
      selectUrbanValue: opt,
    })

    // this is still not quite working.  I want the layout to update
    // but having some issues getting it from the API
    axios.get(states+'/'+opt)
      .then((res) => {
        this.setState({layout: layout})  // try to change later

      return axios.get(spec+'/urban/'+opt);
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
      <div
        className="App"
        style={{
          paddingTop: '10px',
          //paddingLeft: '5%',
          //paddingRight: '-5%',
          background:'#ECECEC'
        }}>
          <Layout>
            <Header theme='light'>
              <h2 className='logo'>US Census</h2>
            </Header>
            <Content>
              <div
                style={{
                  marginTop:'1%',
                  marginLeft:'2%',
                  marginRight:'2%',
                }}
                >
                <Row>
                  <Col span={6}>
                      <Select
                        showSearch
                        defaultValue="Urban or rural"
                        style={{ width: '100%' }}
                        onChange={ this.onUrbanSelectChange }
                      >
                          <Option key='urban'>Urban </Option>
                          <Option key='rural'>Rural </Option>
                      </Select>
                  </Col>
                  <Col span={18}>
                    <Select
                      showSearch
                      defaultValue="Select a state"
                      style={{ width: '100%' }}
                      onChange={ this.onSelectChange }
                    >
                      { this.state.options.map(st =>
                        <Option key={ st.value }>{ st.label } </Option>) }
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Plot
                    data={ this.state.data }
                    layout={ this.state.layout }
                    style={
                      {
                        width: '100%',
                        height: '100%',
                      }
                     }
                    useResizeHandler={ true }
                    config={{
                      mapboxAccessToken: AccessToken,
                      displaylogo: false,
                    }}>
                  </Plot>
                </Row>
              </div>
            </Content>
            <Footer></Footer>
          </Layout>
      </div>
    );
  }
}

export default Map;

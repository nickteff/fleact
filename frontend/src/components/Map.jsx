import React, { Component } from 'react';
import {Row, Col, Select, Layout} from 'antd';
import "antd/dist/antd.css";
//import Select from 'react-select';
import Plot from 'react-plotly.js';
import axios from 'axios';

const { Header, Content} = Layout;

const Option = Select.Option;

const gutter = { "xs": 8, "sm": 8, "md": 8, "lg": 16 };

const map = 'api/map';
const states = '/api/states';
const bar = 'api/bar';

class Map extends Component {
  state = {
    selectUrbanValue: 'both',
    selectStateValue: 'USA',
    options: [],
    mapData: [],
    mapLayout: {},
    incomeData: [],
    incomeLayout: {},
    generationData: [],
    generationLayout: {},
    educationData: [],
    educationLayout: {},
  };

  componentDidMount() {
    axios.get(states)
      .then((res) => {
        this.setState({ options: res.data.options })
      })
      .catch((error) => {
        console.error(error);
      });

      axios.get(
        map+'/'+this.state.selectStateValue+'/'+this.state.selectUrbanValue
      )
        .then((res) => {
          this.setState(() => {
            return {
            mapData: res.data.data,
            mapLayout: res.data.layout,
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
      axios.get(
        map + '/' + this.state.selectStateValue + '/' + this.state.selectUrbanValue
      )
        .then((res) => {
          this.setState(() => {
            return {
              mapData: res.data.data,
              mapLayout: res.data.layout,
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
      axios.get(
        bar + '/' + this.state.selectStateValue + '/' + this.state.selectUrbanValue + '/income'
      )
        .then((res) => {
          this.setState(() => {
            return {
              incomeData: res.data.data,
              incomeLayout: res.data.layout,
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });

  }

  onStateSelectChange = opt => {
    this.setState(() => {
      return { selectStateValue: opt}
    });


    console.log(this.state.selectStateValue);
    axios.get(map+'/'+opt+'/'+this.state.selectUrbanValue)
      .then((res) => {
        this.setState({
          mapData: res.data.data,
          mapLayout: res.data.layout})
        
      })
      .catch((err) => {
        console.error(err)
      });
  };

  onUrbanSelectChange = opt => {
    this.setState(() => {
      return { selectUrbanValue: opt}
    });

    axios.get(map+'/'+this.state.selectStateValue+'/'+opt)
      .then((res) => {
        this.setState({
          mapData: res.data.data,
          mapLayout: res.data.layout})

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
                <Row gutter={gutter}>
                  <Col span={6}>
                      <Select
                        defaultValue="Urban or rural"
                        style={{ width: '100%' }}
                        onChange={ this.onUrbanSelectChange }
                      >
                          <Option key='both'>Both </Option>
                          <Option key='urban'>Urban </Option>
                          <Option key='rural'>Rural </Option>
                      </Select>
                  </Col>
                  <Col xs={0} sm={18}>
                    <Select
                      defaultValue="Select a state"
                      style={{ width: '100%' }}
                      onChange={ this.onStateSelectChange }
                    >
                      { this.state.options.map(st =>
                        <Option key={ st.value }>{ st.label } </Option>) }
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col lg={16} md={16} xs={24}>
                    <Plot
                      data={ this.state.mapData }
                      layout={ this.state.mapLayout }
                      style={
                        {
                          width: '100%',
                          height: '600px',
                        }
                       }
                      useResizeHandler={ true }
                      config={{
                        displaylogo: false,
                      }}>
                    </Plot>

                  </Col>
                  <Col lg={8} md={8} xs={0}>
                    <Row>
                      <Plot
                        data={ this.state.incomeData }
                        layout={ this.state.incomeLayout }
                        style={
                          {
                            width: '100%',
                            height: '200px',
                          }
                        }
                        config={{
                          displayModeBar: false,
                        }}>
                      </Plot>
                    </Row>
                    <Row>
                      <Plot
                        data={this.state.incomeData}
                        layout={this.state.incomeLayout}
                        style={
                          {
                            width: '100%',
                            height: '200px',
                          }
                        }
                        config={{
                          displayModeBar: false,
                        }}>
                      </Plot>
                    </Row>
                    <Row>
                      <Plot
                        data={this.state.incomeData}
                        layout={this.state.incomeLayout}
                        style={
                          {
                            width: '100%',
                            height: '200px',
                          }
                        }
                        config={{
                          displayModeBar: false,
                        }}>
                      </Plot>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Content>
          </Layout>
      </div>
    );
  }
}

export default Map;

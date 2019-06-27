import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase'
import { Container, Content, Row, Text, Col } from 'native-base';
import Header from '../components/Header';
import QRCode from 'react-native-qrcode';
export default class ViewHistory extends React.Component {
  state = {
    data: this.props.navigation.getParam('item'),
    prescription: ''
  }
  componentDidMount() {
    let med = []
    this.state.data.prescription.map(item => {
      med.push(`${item.name}*${item.desc}?${new Date(item.date.seconds * 1000).toLocaleDateString()}`)
    })
    let prescription = ''
    med.map(item => {
      prescription += item + ','
    })
    this.setState({ prescription })
  }
  render() {
    const { data } = this.state
    return (
      <Container>
        <Header title='HISTORY' backgroundColor='#2A2E43' color='white' />
        <Content style={{ marginTop: 50 }}>
          <Row>
            <Col size={10} />
            <Col size={60}>
              <Row>
                <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: '#2A2E43', alignSelf: 'center', top: 1, right: 5 }} />
                <Text style={{ alignSelf: 'center', fontSize: 16, color: '#2A2E43', fontWeight: '300' }}>Dr.{data.doctor}</Text>
              </Row>
            </Col>
            <Col size={30}>
              <Text note style={{}}>{new Date(data.date.seconds * 1000).toLocaleDateString()}</Text>
            </Col>
          </Row>
          <Row style={{ marginTop: 15 }}>
            <Col size={10} />
            <Col size={80}>
              <Text style={{ color: '#78849E', fontSize: 16, fontWeight: 'bold' }}>Diagnose:
              <Text style={{ color: '#78849E', fontSize: 14, fontWeight: '100' }}>{data.diagnose}</Text>
              </Text>
            </Col>
            <Col size={10} />

          </Row>
          {this.state.prescription != null ? <Content style={{ marginTop: 50, height: 200, alignSelf: 'center' }}>
            <QRCode
              value={this.state.prescription}
              size={200}
              bgColor='black'
              fgColor='white' />
          </Content> : null
          }
        </Content>
      </Container>
    );
  }
}

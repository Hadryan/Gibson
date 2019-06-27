import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Container, Content, Button, ActionSheet, Title, Right, Text, Row, Col, Input, Form, Root } from 'native-base';
import Header from '../components/Header';
export default class FinishedView extends React.Component {
  state = {
    data: this.props.navigation.getParam('data'),
  }
  render() {
    const { data } = this.state
    return (
      <Container>
        <Header title='Reservations' backgroundColor='#78849E' color='white' />
        <Content style={{ marginTop: 75, marginLeft: 30, marginRight: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#454F63' }}>{new Date(data.date.seconds * 1000).toLocaleDateString()}</Text>
          <Text style={{ width: '100%', height: 100, maxHeight: 200, color: '#78849E', marginTop: 20, }}><Text style={{ color: '#78849E', fontWeight: '600' }}>Diagnose: </Text>{data.diagnose}</Text>
          <Text style={{ color: '#78849E', fontWeight: '600', marginTop: 10 }}>Prescription:</Text>
          {data.prescription.map((item, i) => {
            return <Row style={{ width: '85%', alignSelf: 'center', marginTop: 10 }} key={i}>
              <Col>
                <Text style={{ color: '#78849E' }}>{item.name}</Text>
              </Col>
              <Col style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#78849E' }}>{item.desc}</Text>
              </Col>
            </Row>
          })}
        </Content>
      </Container>
    );
  }
}

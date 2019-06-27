import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { Container, Text, CardItem, Row, Content, Col, Button } from 'native-base';
import * as firebase from 'firebase'
require('firebase/firestore')

export default class FinishedCourse extends React.Component {
  state = {
    data: [],
    index: []
  }
  componentDidMount() {
    let user = firebase.auth().currentUser.email
    firebase.firestore().collection('Booking').where('patient', '==', user).get().then(snap => {
      let data = []
      snap.forEach(doc => {
        if (doc.data().prescription.length != 0) {
          data.push(doc.data())
        }
      })
      this.setState({ data })
    })
  }
  renderDrugs(item, i) {
    let date = new Date().getTime()
    let itemDate = new Date(item.date.seconds * 1000).getTime()
    if (date > itemDate) {
      return <TouchableOpacity key={i} style={{ marginTop: 10 }} onPress={() => alert('End at: ' + new Date(itemDate).toLocaleDateString())}>
        <Row >
          <Col size={20} />
          <Col size={45} style={{}}>
            <Text note style={{ textAlign: 'left' }}>{item.name}</Text>
          </Col>
          <Col size={35}>
            <Text note>{item.desc}</Text>
          </Col>
        </Row>
      </TouchableOpacity>
    } else {
      return null
    }


  }
  renderItem = (item, i) => {
    return <View key={i} style={{ marginBottom: 50 }}>
      <Row>
        <Col size={15} />
        <Col size={50}>
          <Row>
            <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: '#2A2E43', alignSelf: 'center', top: 1, right: 5 }} />
            <Text style={{ alignSelf: 'center', fontSize: 16, color: '#2A2E43', fontWeight: '500' }}>{'Dr.' + item.doctorName}</Text>
          </Row>
        </Col>
        <Col size={35}>
          <Text note style={{ color: '#352641' }}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
        </Col>
      </Row>
      <Content>
        {item.prescription.map((d, i) => {
          return this.renderDrugs(d, i)
        })}
      </Content>
    </View>
  }
  render() {
    return (
      <Container>
        <Content style={{ marginTop: 30 }}>
          {this.state.data.map((item, i) => {
            return this.renderItem(item, i)
          })}
        </Content>
      </Container>
    );
  }
}

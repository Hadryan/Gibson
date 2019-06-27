import React from 'react';
import { View, TouchableOpacity, } from 'react-native';
import * as firebase from 'firebase'
import { Container, Content, Row, Text, Col } from 'native-base';
import Header from '../components/Header';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import ViewHistory from '../views/ViewHistory';
class History extends React.Component {
  state = {
    data: []
  }
  componentDidMount() {
    let user = firebase.auth().currentUser.email
    let ref = firebase.firestore().collection('Booking')
    ref.where('patient', '==', user).get().then(snap => {
      let data = []
      snap.forEach(doc => {
        data.push(doc.data())
      })
      this.setState({ data })
    })
  }
  handleView = (item) => {
    let date = new Date(item.date.seconds * 1000).getTime()
    let dateNow = new Date().getTime()
    if (date < dateNow && item.finished) {
      this.props.navigation.navigate('ViewHistory', {
        item: item
      })
    } else {
      alert('No History yet!')
    }
  }
  render() {
    return (
      <Container>
        <Header title='HISTORY' backgroundColor='#2A2E43' color='white' />
        <Content style={{ marginTop: 75 }}>
          {this.state.data.map((item, i) => {
            return <TouchableOpacity key={i} style={{ padding: 5, marginBottom: 15 }} onPress={() => this.handleView(item)}>
              <Row>
                <Col size={10} />
                <Col size={60}>
                  <Row>
                    <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: '#2A2E43', alignSelf: 'center', top: 1, right: 5 }} />
                    <Text style={{ alignSelf: 'center', fontSize: 16, color: '#2A2E43', fontWeight: '300' }}>Dr.{item.doctorName}</Text>
                  </Row>
                </Col>
                <Col size={30}>
                  <Text note style={{}}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
                </Col>
              </Row>
            </TouchableOpacity>
          })}
        </Content>
      </Container>
    );
  }
}
const Navigator = createStackNavigator({
  History,
  ViewHistory
}, {
    headerMode: 'none'
  })
export default createAppContainer(Navigator)
import React from 'react';
import { StatusBar, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import * as firebase from 'firebase'
import Header from '../components/Header';
import { Content, Container, Row } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
export default class Home extends React.Component {
  async componentDidMount() {
    let d = await AsyncStorage.setItem('new', 'true')
  }
  async handleLogOut() {
    firebase.auth().signOut();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'LoginNav' })
      ]
    })
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#2A2E43' }}>
        <StatusBar barStyle='light-content' />
        <Header backgroundColor='#2A2E43' color='white' title='Gibson' />
        <Content>
          <Row style={{ alignSelf: 'center', marginTop: 100 }}>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => {
              this.props.navigation.navigate('Doctors');
            }}>
              <Ionicons name='md-pin' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Doctors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#FF4F4F', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('Emergency')}>
              <Ionicons name='md-medkit' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Emergency</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('Medicine')}>
              <Ionicons name='md-water' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Medicine</Text>
            </TouchableOpacity>
          </Row>
          <Row style={{ alignSelf: 'center', marginTop: 100 }}>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('History')}>
              <Ionicons name='md-albums' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#454F63', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('TestResult')}>
              <Ionicons name='md-git-network' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.handleLogOut()}>
              <Ionicons name='ios-log-out' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Logout</Text>
            </TouchableOpacity>
          </Row>
        </Content>
      </Container>
    );
  }
}

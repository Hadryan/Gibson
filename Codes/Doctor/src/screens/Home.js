import React from 'react';
import { StatusBar, Text, AsyncStorage, TouchableOpacity, View } from 'react-native';
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
      <Container style={{ backgroundColor: '#78849E' }}>
        <StatusBar barStyle='light-content' />
        <Header backgroundColor='#78849E' color='white' title='Gibson' />
        <TouchableOpacity style={{padding:5,alignSelf:'flex-end',margin:20,marginTop:5}} onPress={()=>this.handleLogOut()}>
          <Text style={{color:'white'}}>Logout</Text>
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', marginTop: '40%' }}>
          <Row style={{ alignSelf: 'center', }}>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('Reservations')}>
              <Ionicons name='md-albums' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Reservations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#454F63', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() => this.props.navigation.navigate('TestResult')}>
              <Ionicons name='md-git-network' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, height: 75, backgroundColor: '#353A50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 5 }} onPress={() =>this.props.navigation.navigate('Profile')}>
              <Ionicons name='ios-person' size={20} color='white' />
              <Text style={{ color: 'white', fontWeight: '400' }}>Profile</Text>
            </TouchableOpacity>
          </Row>
        </View>
      </Container>
    );
  }
}

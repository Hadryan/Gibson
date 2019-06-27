import React from 'react';
import { AsyncStorage, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase'
import { Container, Button } from 'native-base';
export default class Welcome extends React.Component {
  async componentDidMount() {
    let d = await AsyncStorage.setItem('new', 'false')
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#78849E', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
          this.props.navigation.navigate('Login')
        }}>
          <Image source={require('../../assets/logo.png')} style={{ width: 190, height: 45 }} />
        </TouchableOpacity>
      </Container>
    );
  }
}

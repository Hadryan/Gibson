import React from 'react';
import { StyleSheet, Text, TouchableOpacity,Image } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation'
import { Container, Button } from 'native-base';
import Login from './Login';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as firebase from 'firebase'
class Welcome extends React.Component {
render() {
// playground

    return (
      <Container style={{backgroundColor:'#5c0000',alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={{padding:5}} onPress={()=>{
        this.props.navigation.navigate('Login')
      }}>
      <Image source={require('../../assets/logo.png')} style={{width:190,height:45}}/>
          <Text style={{color:'white',paddingLeft:5, fontSize:25}}>
              <Ionicons style={{paddingLeft:5}} name='md-medkit' size={20} color='white' /> Emergency
          </Text>
      </TouchableOpacity>
      </Container>
    );
  }
}

const Navigator=createStackNavigator({
  Welcome,
  Login
},{
  headerMode:'none'
})

export default createAppContainer(Navigator)
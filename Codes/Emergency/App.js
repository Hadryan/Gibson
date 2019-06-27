import React from 'react';
import {StyleSheet, AsyncStorage, View, YellowBox} from 'react-native';
import Login from './src/screens/Login';
import { Font } from 'expo';
import * as firebase from 'firebase'
import Home from './src/screens/Home';
import Welcome from './src/screens/Welcome';

YellowBox.ignoreWarnings(['Setting a timer', 'Warning:']);

var config = {
  apiKey: "AIzaSyAfUvEROq5UEPVlnBOmkFtdhWY4pNxVuCM",
  authDomain: "testing-d61f5.firebaseapp.com",
  databaseURL: "https://testing-d61f5.firebaseio.com",
  projectId: "testing-d61f5",
  storageBucket: "testing-d61f5.appspot.com",
  messagingSenderId: "505319529871"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    user:null
};
async componentDidMount(){
    await Font.loadAsync({
        'Roboto_medium':require('./node_modules/native-base/Fonts/Roboto_medium.ttf')
    });
    let usr=await AsyncStorage.getItem('user');
    this.setState({ fontLoaded: true,user:usr });
}
async renderItem(){
  return <Login/>
}
render() {
    return (
      this.state.fontLoaded?this.state.user!=null?<Home/>:<Welcome/>:null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5c0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

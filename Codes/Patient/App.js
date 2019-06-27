import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { Font } from 'expo'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Fire from './src/components/Fire';
import LoginNav from './src/components/LoginNav';
import HomeNav from './src/components/HomeNav';
class App extends React.Component {
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto_medium': require('./node_modules/native-base/Fonts/Roboto_medium.ttf')
    })
    this.setState({ fontLoaded: true });
    this.checkAsync()
  }
  async checkAsync() {
    const data = await AsyncStorage.getItem('new');
    if (data == 'true') {
      this.props.navigation.replace('HomeNav')
    } else {
      this.props.navigation.replace('LoginNav')
    }
  }
  render() {
    return (
      this.state.fontLoaded ? <View /> : null
    );
  }
}
const Nav = createStackNavigator({
  App,
  LoginNav,
  HomeNav,
}, {
    headerMode: 'none',
  })
export default createAppContainer(Nav)
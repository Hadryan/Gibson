import React from 'react';
import { StatusBar, View ,TouchableOpacity,FlatList} from 'react-native';
import { Container, Content,Text, Button, Row } from 'native-base';
import Header from '../components/Header';
import ActiveCourse from '../views/ActiveCourse';
import FinishedCourse from '../views/FinishedCourse';

import { createMaterialTopTabNavigator,createAppContainer,createStackNavigator } from 'react-navigation';
class Medicine extends React.Component {
render() {
  }
}
const TabNavigator=createMaterialTopTabNavigator({
    Active:ActiveCourse,
    Finished:FinishedCourse,
},{
    animationEnabled:false,
    tabBarOptions:{
        indicatorStyle:{backgroundColor:'white'},
        style:{
            backgroundColor:'transparent',
            elevation:0,
            padding:0,
            margin:0
        },
        labelStyle:{
            fontSize:20,
            color:'#2A2E43',
            fontWeight:'bold'
        }
    },
})
const Navigator =createStackNavigator({
    Home:{
        screen:TabNavigator,
        navigationOptions: ({navigation}) => ({
            header: <Header title='MEDICINE' backgroundColor='#2A2E43' color='white'/>,
        })    
    },
},{
})
export default createAppContainer(Navigator)
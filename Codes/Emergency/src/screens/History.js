import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation'
import * as firebase from 'firebase'
import {MapView } from 'expo'
import { Container,Content,Row } from 'native-base';
import { GeoFire } from 'geofire';
import Ionicons from '@expo/vector-icons/Ionicons';
require('firebase/firestore')
import Header from '../components/Header';

class History extends React.Component {
    state = {
        data: this.props.navigation.getParam('data'),
    }
    getHistory(){
        let ret = [];
        this.state.data.map((item,i)=>{if(item.finished)ret.push(item)});
        return ret;
    }
render() {
    return (
        <Container>
            <Header title='HISTORY' backgroundColor='#5c0000' color='white' btn={()=>{this.props.navigation.goBack()}}/>
            <Content style={{marginTop:10}}>
                {this.getHistory().map((item)=>{
                    return(
                    <Row style={{padding:5,flex:1,alignItems:'center',justifyContent:'center',alignSelf:'center',color:'black',marginTop:10,backgroundColor:'#D2D2D2',fontSize:16,fontWeight:'400',width:'100%',}}>
                        <Row>
                        <Text style={{alignSelf:'center',fontSize:16,color:'#2A2E43',fontWeight:'300'}}>Created: {(new Date(item.Date)).toISOString()}</Text>
                        </Row>
                        <Row>
                            <Text style={{alignSelf:'center',fontSize:16,color:'#2A2E43',fontWeight:'300'}}>Position: {"\n"}lat:{item.location.latitude}, {"\n"}long:{item.location.longitude}</Text>
                        </Row>
                        <Row>
                            <Text style={{alignSelf:'center',fontSize:16,color:'#2A2E43',fontWeight:'300'}}>State: {item.accepted ? 'Accepted' : 'Canceled'}</Text>
                        </Row>
                    </Row>);
                })}
            </Content>
        </Container>
    );
  }
}

const Navigator=createStackNavigator({
    History,
},{
    headerMode:'none'
})
export default createAppContainer(Navigator)

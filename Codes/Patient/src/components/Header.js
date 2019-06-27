import React from 'react';
import { View ,StatusBar,TouchableOpacity } from 'react-native';
import { Button, Text, Row, Col } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
let statusheight=StatusBar.currentHeight
export default class Header extends React.Component {
render() {
    return (
    <View style={{height:60,marginTop:statusheight,backgroundColor:this.props.backgroundColor}}>
        <StatusBar barStyle='dark-content'/>
        <Row style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:22,fontWeight:'100',color:this.props.color}}>{this.props.title}</Text>
        </Row>
    </View>    
    );
  }
}



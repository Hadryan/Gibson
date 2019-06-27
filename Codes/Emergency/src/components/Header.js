import React from 'react';
import { View ,StatusBar } from 'react-native';
import { Button, Text, Row, Col } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
let statusheight=StatusBar.currentHeight
export default class Header extends React.Component {
render() {
    return (
    <View style={{height:60,paddingTop:10,marginTop:statusheight,backgroundColor:this.props.backgroundColor}}>
        <StatusBar barStyle='dark-content'/>
        <Row style={{justifyContent:'center'}}>
            <Col size={40} style={{alignItems:'center'}}>
                <Button transparent style={{marginLeft:25}} onPress={this.props.btn}>
                    <Ionicons name='ios-arrow-back' color={this.props.color} size={25} />
                </Button>
            </Col>
            <Col size={60} style={{alignItems:'flex-start'}}>
                <Text style={{marginTop:7,fontSize:22,fontWeight:'100',color:this.props.color}}>{this.props.title}</Text>
            </Col>
        </Row>
    </View>    
    );
  }
}



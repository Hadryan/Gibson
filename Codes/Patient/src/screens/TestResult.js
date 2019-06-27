import React from 'react';
import { View,RefreshControl } from 'react-native';
import * as firebase from 'firebase'
import { Container, Row, Col,Text, Content, Item, Spinner, } from 'native-base';
require('firebase/firestore')

import Header from '../components/Header';
export default class TestResult extends React.Component {
    state={
        data:[],
        refreshing: false,
        loaded:false,
    }
    componentDidMount(){
        this.getData()
    }
    getData=()=>{
        let user=firebase.auth().currentUser.email
        firebase.firestore().collection('TestResult').where('patient','==',user).orderBy('date').get().then(snap=>{
            let data=[]
            snap.forEach(doc=>{
                data.push(doc.data())
            })
            this.setState({data:data.reverse(),loaded:true})
        })
    }
    renderItem=(item,i)=>{
        return <View key={i} style={{paddingLeft:20,marginBottom:40}}>
        <Text style={{fontWeight:'bold',fontSize:18,color:'#352641',marginBottom:10}}>{new Date(item.date.seconds*1000).toDateString()}</Text>
            {item.data.map((test,j)=>{
                return <Row key={j} style={{marginTop:10,justifyContent:'flex-start',marginRight:20}}>
                <Col size={40}>
                <Text style={{fontSize:16,color:'#78849E'}}>{test.name}</Text>
                </Col>
                <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E'}}>{test.unit}</Text>                
                </Col>
                <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E'}}>{test.result}</Text>                
                </Col>
                <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E'}}>{test.refrence}</Text>                
                </Col>
            </Row>    
            })}
        </View>

    }
    renderContent(){
        return <Content style={{marginTop:25}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.getData()}/>}> 
        {this.state.data.map((item,i)=>{
            return this.renderItem(item,i)
        })}
        </Content>

    }
render() {
    return (
        <Container>
        <Header title='RESULTS' backgroundColor='#2A2E43' color='white' btn={()=>{
            this.props.navigation.goBack() 
        }} />
        <Row style={{marginTop:15,borderBottomWidth:0.7,borderTopWidth:0.7,height:35,justifyContent:'flex-start',paddingTop:7,borderColor:'silver',paddingRight:20,paddingLeft:20}}>
            <Col size={40} />
            <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E',fontWeight:'bold'}}>Unit</Text>
            </Col>
            <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E',fontWeight:'bold'}}>Result</Text>
            </Col>
            <Col size={20} style={{alignItems:'center'}}>
                <Text style={{fontSize:14,color:'#78849E',fontWeight:'bold'}}>Refrence</Text>
            </Col>
        </Row>
        {this.state.loaded?this.renderContent():<Spinner/>}
        </Container>
    );
  }
}

import React from 'react';
import { Geolocation,TouchableOpacity, KeyboardAvoidingView,ScrollView,View} from 'react-native';
import { Container, Content, Button, Body, Title, Right, Text, Row, Col, Input, Form, Toast, DatePicker, Root,Picker } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
require('firebase/firestore')

export default class Register extends React.Component {
    state={
        coordinate:{
            latitude:0,
            longitude:0,
            latitudeDelta:0,
        },
        name:'',
        email:'',
        password:'',
        bdate:'',
        phone:'',

    }
    async componentDidMount(){
        await navigator.geolocation.getCurrentPosition(pos=>{
            let coordinate={latitude:pos.coords.latitude,longitude:pos.coords.longitude,latitudeDelta: 0.015,longitudeDelta: 0.0121,}
            this.setState({coordinate})
        })
    }
    handleRegister=()=>{
        const {email,password} =this.state
        return firebase.auth().createUserWithEmailAndPassword(email,password).then(data=>{
            Toast.show({
                text: 'success, please wait',
                buttonText: "Okay",
                duration: 2500,
                type:'success'
            })    
            this.handleUserData(data.user.email)
        }).catch((err)=>{
            let error=err.code.split('/')
            Toast.show({
                text: error[1],
                buttonText: "Okay",
                duration: 2500,
                type:'danger'
            })
        })
    }
    handleUserData=(email)=>{
        const {name,phone,bdate,coordinate} =this.state
        console.log(email);
        let key = 'stw'+new Date().getTime();
        
        firebase.firestore().collection('Emergency').doc(name).set({
            name:name,
            email:email,
            phone:phone,
            carId:'car_' + new Date().getTime(),
            birthDate:bdate,
            createDate:new Date().toLocaleString(),
            location:coordinate,
            state:true,
        }).then((doc)=>{
            firebase.database().ref("Emergency").child(name).set({
                g: key,
                l: {
                    0: coordinate.latitude,
                    1: coordinate.longitude
                }
            }).then((data) => {
                console.log('data ', data)
                this.props.navigation.navigate('Home')
            }).catch((error) => {
                console.log('error ', error)
            })
        })
    }
  render() {
    return (
        <Root>
        <Container style={{backgroundColor:'white'}}>
        <Header title='SIGN UP' backgroundColor='#5c0000' color='white' btn={()=>{
            this.props.navigation.goBack()
        }} />
        <ScrollView style={{flex:1}}>
        <KeyboardAvoidingView behavior='padding' contentContainerStyle={{flex:1}}>
            <Form style={{marginTop:45,width:'100%',}}>
                <Input placeholder='Name' placeholderTextColor='#E3E6EE' style={{marginTop:25,width:'90%',height:52,padding:15,paddingLeft:20,paddingRight:20,fontFamily:'Roboto_medium',backgroundColor:'#454F63',borderRadius:10,alignSelf:'center',color:'white'}} onChangeText={name=>this.setState({name})} value={this.state.name} />
                <Input placeholder='Email' placeholderTextColor='#E3E6EE' style={{width:'90%',height:52,padding:15,paddingLeft:20,paddingRight:20,fontFamily:'Roboto_medium',backgroundColor:'#454F63',borderRadius:10,alignSelf:'center',color:'white',marginTop:25}} onChangeText={email=>this.setState({email})} value={this.state.email} />
                <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={{width:'90%',height:52,padding:15,paddingLeft:20,paddingRight:20,fontFamily:'Roboto_medium',backgroundColor:'#454F63',borderRadius:10,alignSelf:'center',marginTop:25,color:'white'}} onChangeText={password=>this.setState({password})} value={this.state.password} />
                <Input placeholder='Phone' placeholderTextColor='#E3E6EE' style={{width:'90%',height:52,padding:15,paddingLeft:20,paddingRight:20,fontFamily:'Roboto_medium',backgroundColor:'#454F63',borderRadius:10,alignSelf:'center',marginTop:25,color:'white'}} onChangeText={phone=>this.setState({phone})} value={this.state.phone} />
                <View style={{width:'90%',height:52,backgroundColor:'#454F63',borderRadius:10,alignSelf:'center',marginTop:25,flexDirection:'row'}}>
                <Text style={{color:'#E3E6EE',fontFamily:'Roboto_medium',fontSize:18,padding:15,paddingLeft:20}}>Birth Date:</Text>
                <DatePicker placeHolderTextStyle={{color:'#E3E6EE'}} textStyle={{color:'white',paddingRight:40,fontFamily:'Roboto_medium',padding:15,paddingLeft:40,fontSize:18}} defaultDate={new Date(1985,1,1)} maximumDate={new Date(2010, 12, 31)} minimumDate={new Date(1920, 1, 1)} animationType='slide' onDateChange={bdate=>this.setState({bdate})} />
                </View>

                <TouchableOpacity style={{width:'90%',height:52,alignItems:'center',justifyContent:'center',backgroundColor:'#2A2E43',borderRadius:10,alignSelf:'center',marginTop:30}} onPress={this.handleRegister}>
                    <Text style={{color:'white',}}>CONTINUE</Text>
                </TouchableOpacity>    
            </Form>
        </KeyboardAvoidingView>
        </ScrollView>        
      </Container> 
      </Root>   
      );
  }
}

    

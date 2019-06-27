import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Container, Content, Button, Body, Title, Right, Text, Row, Col, Input, Form, Toast, DatePicker, Root } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
require('firebase/firestore')
import { GeoFire } from 'geofire';

export default class Register extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        phone: '',
        coordinate: {}
    }
    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(pos => {
            let coordinate = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
            this.setState({ coordinate })
            this.getNearby()
        })
    }
    handleRegister = () => {
        const { email, password, name } = this.state
        return firebase.auth().createUserWithEmailAndPassword(email, password).then(data => {
            Toast.show({
                text: 'success, please wait',
                buttonText: "Okay",
                duration: 2500,
                type: 'success'
            })
            data.user.updateProfile({
                displayName: name,
            })
            this.handleUserData(data.user.email)
        }).catch((err) => {
            console.log(err);
            Toast.show({
                text: 'something went wrong!',
                buttonText: "Okay",
                duration: 2500,
                type: 'danger'
            })
        })
    }
    handleUserData = (email) => {
        const { name, phone, coordinate, } = this.state
        console.log(email);
        firebase.firestore().collection('Doctors').doc(name).set({
            name: name,
            email: email,
            phone: phone,
            createDate: new Date().toLocaleString(),
            bio: '',
            address: '',
            coordinate: coordinate,
            thumbnail: '',
            state:true
        }).then(() => {
            var firebaseRef = firebase.database().ref('Doctors');
            var geoFire = new GeoFire(firebaseRef);
            geoFire.set(name,[coordinate.latitude,coordinate.longitude]).then(()=>{
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'HomeNav' })
                    ]
                })
                this.props.navigation.dispatch(resetAction);    
            })
        })
    }
    render() {
        return (
            <Root>
                <Container style={{ backgroundColor: 'white' }}>
                    <Header title='SIGN UP' backgroundColor='#78849E' color='white' />
                    <ScrollView style={{ flex: 1 }}>
                        <KeyboardAvoidingView behavior='padding' enabled contentContainerStyle={{ flex: 1, }}>
                            <Form style={{ marginTop: 75, width: '100%', }}>
                                <Input placeholder='Name' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', color: 'white' }} onChangeText={name => this.setState({ name })} value={this.state.name} />
                                <Input placeholder='Email' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', color: 'white', marginTop: 25 }} onChangeText={email => this.setState({ email })} value={this.state.email} />
                                <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={password => this.setState({ password })} value={this.state.password} />
                                <Input placeholder='Phone' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={phone => this.setState({ phone })} value={this.state.phone} />
                                <TouchableOpacity style={{ width: '90%', height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2E43', borderRadius: 10, alignSelf: 'center', marginTop: 100 }} onPress={this.handleRegister}>
                                    <Text style={{ color: 'white', }}>CONTINUE</Text>
                                </TouchableOpacity>
                            </Form>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Container>
            </Root>
        );
    }
}



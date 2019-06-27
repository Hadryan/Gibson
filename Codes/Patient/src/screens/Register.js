import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Container, Content, Button, Body, Title, Right, Text, Row, Col, Input, Form, Toast, DatePicker, Root } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
require('firebase/firestore')
import { NavigationActions, StackActions } from 'react-navigation';

export default class Register extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        bdate: new Date(1985, 1, 1),
        phone: '',
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
                displayName: name
            })
            this.handleUserData(data.user.email)
        }).catch((err) => {
            let error = err.code.split('/')
            Toast.show({
                text: error[1],
                buttonText: "Okay",
                duration: 2500,
                type: 'danger'
            })
        })
    }
    handleUserData = (email) => {
        const { name, phone, bdate, } = this.state
        firebase.firestore().collection('Users').doc(email).set({
            name: name,
            email: email,
            phone: phone,
            birthDate: bdate,
            createDate: new Date().toLocaleString()
        }).then(() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'HomeNav' })
                ]
            })
            this.props.navigation.dispatch(resetAction);
        })
    }
    render() {
        return (
            <Root>
                <Container style={{ backgroundColor: 'white' }}>
                    <Header title='SIGN UP' backgroundColor='#2A2E43' color='white' />
                    <ScrollView style={{ flex: 1 }}>
                        <KeyboardAvoidingView behavior='padding' contentContainerStyle={{ flex: 1 }}>
                            <Form style={{ marginTop: 75, width: '100%', }}>
                                <Input placeholder='Name' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#454F63', borderRadius: 10, alignSelf: 'center', color: 'white' }} onChangeText={name => this.setState({ name })} value={this.state.name} />
                                <Input placeholder='Email' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#454F63', borderRadius: 10, alignSelf: 'center', color: 'white', marginTop: 25 }} onChangeText={email => this.setState({ email })} value={this.state.email} />
                                <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#454F63', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={password => this.setState({ password })} value={this.state.password} />
                                <Input placeholder='Phone' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#454F63', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={phone => this.setState({ phone })} value={this.state.phone} />
                                <View style={{ width: '90%', height: 52, backgroundColor: '#454F63', borderRadius: 10, alignSelf: 'center', marginTop: 25, flexDirection: 'row' }}>
                                    <Text style={{ color: '#E3E6EE', fontFamily: 'Roboto_medium', fontSize: 18, padding: 15, paddingLeft: 20 }}>Birth Date:</Text>
                                    <DatePicker placeHolderTextStyle={{ color: '#E3E6EE' }} textStyle={{ color: 'white', paddingRight: 40, fontFamily: 'Roboto_medium', padding: 15, paddingLeft: 40, fontSize: 18 }} defaultDate={new Date(1985, 1, 1)} maximumDate={new Date(2010, 12, 31)} minimumDate={new Date(1920, 1, 1)} animationType='slide' onDateChange={bdate => this.setState({ bdate })} />
                                </View>
                                <TouchableOpacity style={{ width: '90%', height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2E43', borderRadius: 10, alignSelf: 'center', marginTop: 50 }} onPress={this.handleRegister}>
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



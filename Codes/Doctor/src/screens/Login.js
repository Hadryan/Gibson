import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Container, Content, Button, ActionSheet, Title, Right, Text, Row, Col, Input, Form, Root } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
import Toast, { DURATION } from 'react-native-easy-toast'
export default class Login extends React.Component {
    state = {
        email: '',
        password: '',
    }
    handleRegister = () => {
        Toast.toastInstance = null;
        return this.props.navigation.navigate('Register')
    }
    handleLogin = () => {
        const { email, password } = this.state
        return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'HomeNav' })
                ]
            })
            this.props.navigation.dispatch(resetAction);
        }).catch(err => {
            this.refs.toast.show(err.toString(), 1000, () => {
                // something you want to do at close
            });
        })
    }
    render() {
        return (
            <Container style={{ backgroundColor: '#78849E' }}>
                <Header title='LOGIN' backgroundColor='white' color='#2A2E43' />
                <Content>
                    <Form style={{ marginTop: 175, width: '100%', }}>
                        <Input placeholder='Email' placeholderTextColor='#E3E6EE' keyboardType='email-address' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: 'white', borderRadius: 10, alignSelf: 'center', }}
                            onChangeText={email => this.setState({ email })} value={this.state.email}
                        />
                        <Input placeholder='Password' placeholderTextColor='#E3E6EE' secureTextEntry style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: 'white', borderRadius: 10, alignSelf: 'center', marginTop: 25 }}
                            onChangeText={password => this.setState({ password })} value={this.state.password}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 50 }}>
                            <TouchableOpacity style={{ width: 100, height: 35, alignItems: 'center', justifyContent: 'center' }} onPress={this.handleLogin}>
                                <Text style={{ color: 'white', }}>SIGN IN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 80, height: 35, backgroundColor: '#5773FF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }} onPress={this.handleRegister}>
                                <Text style={{ color: 'white' }}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    </Form>
                </Content>
                <Toast ref="toast"
                    style={{ backgroundColor: 'red' }}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'white' }}
                />
            </Container>
        );
    }
}

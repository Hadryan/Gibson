import React from 'react';
import { TouchableOpacity, } from 'react-native';
import { Container, Spinner, Text, Content } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import TestList from '../views/TestList';

class TestResult extends React.Component {
    state = {
        data: [],
        loaded: false
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            firebase.firestore().collection('Booking').where('doctor', '==', user.email).get().then(snap => {
                let data = []
                snap.forEach(doc => {
                    data.push(doc.data())
                })
                let result = data.filter(function (a) {
                    return !this[a.patientName] && (this[a.patientName] = true);
                }, Object.create(null));
                this.setState({ data: result, loaded: true })
            })
        })
    }
    handleView(patient, patientName) {
        this.props.navigation.navigate('TestList', {
            patient: patient,
            patientName: patientName
        })
    }

    renderContent() {
        return <Content style={{ marginTop: 75, marginLeft: 30 }}>
            {this.state.data.map((item, i) => {
                return <TouchableOpacity key={i} style={{ padding: 5, marginBottom: 10 }} onPress={() => this.handleView(item.patient, item.patientName)}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#78849E' }}>{item.patientName}</Text>
                </TouchableOpacity>
            })}
        </Content>
    }

    render() {
        return (
            <Container>
                <Header title='Test Result' backgroundColor='#78849E' color='white' />
                {this.state.loaded ? this.renderContent() : <Spinner size='large' />}
            </Container>
        )
    }
}
const Navigator = createStackNavigator({
    TestResult,
    TestList
}, {
        headerMode: 'none'
    })
export default createAppContainer(Navigator)
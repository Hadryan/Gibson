import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Container, Content, Button, ActionSheet, Title, Right, Text, Row, Col, Input, Form, Root, Spinner } from 'native-base';
import Header from '../components/Header';
import FinishedView from './FinishedView'
import ActiveView from './ActiveView'
import * as firebase from 'firebase'
class ReservationsView extends React.Component {
    state = {
        patient: this.props.navigation.getParam('patient'),
        patientName: this.props.navigation.getParam('patientName'),
        data: [],
        loaded: false
    }
    componentDidMount() {
        firebase.firestore().collection('Booking').where('doctor', '==', firebase.auth().currentUser.email).where('patient', '==', this.state.patient).orderBy('date').onSnapshot(snap => {
            let data = []
            snap.forEach(doc => {
                data.push({ data: doc.data(), key: doc.id })
            })
            this.setState({ data, loaded: true })
        })
    }
    handleView(item) {
        if (item.data.finished) {
            this.props.navigation.navigate('FinishedView', {
                data: item.data
            })
        } else {
            this.props.navigation.navigate('ActiveView', {
                data: item.data,
                key: item.key
            })
        }
    }
    renderContent() {
        return <Content style={{ marginTop: 75, marginLeft: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#454F63', padding: 5 }}>{this.state.patientName}</Text>
            {this.state.data.map((item, i) => {
                return <TouchableOpacity key={i} style={{ padding: 5, marginTop: 20 }} onPress={() => this.handleView(item)}>
                    <Text style={{ fontSize: 18, color: '#78849E' }}>{new Date(item.data.date.seconds * 1000).toLocaleDateString()}</Text>
                </TouchableOpacity>
            })}
        </Content>

    }

    render() {
        return (
            <Container>
                <Header title='Reservations' backgroundColor='#78849E' color='white' />
                {this.state.loaded ? this.renderContent() : <Spinner size='large' />}
            </Container>
        )
    }
}

const Navigator = createStackNavigator({
    ReservationsView,
    FinishedView,
    ActiveView
}, {
        headerMode: 'none'
    })
export default createAppContainer(Navigator)
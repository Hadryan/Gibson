import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as firebase from 'firebase'
import { Container, Text, Content, Row, DatePicker } from 'native-base';
import Header from '../components/Header';

export default class Booking extends React.Component {
    state = {
        doctor: this.props.navigation.getParam('doctor'),
        date: new Date(),
    }
    handleBook = () => {
        const { date, doctor, doctorEmail } = this.state
        let usr = firebase.auth().currentUser
        return firebase.firestore().collection('Booking').add({
            patient: usr.email,
            patientName: usr.displayName,
            Createdate: new Date().getTime(),
            date: date,
            doctor: doctor.email,
            doctorName: doctor.name,
            prescription: '',
            diagnose: '',
            finished: false
        }).then(() => {
            this.props.navigation.goBack()
        })
    }
    render() {
        return (
            <Container>
                <Header backgroundColor='#2A2E43' color='white' title='BOOKING' btn={() => { this.props.navigation.goBack() }} />
                <Content style={{ margin: 25, marginTop: 50 }}>
                    <Text style={{ fontSize: 22, alignSelf: 'center', fontWeight: 'bold', color: '#2A2E43', }}>Dr.{this.state.doctor.name}</Text>
                    <Text note style={{ marginTop: 30, fontSize: 14, color: '#78849E', marginRight: 20, marginLeft: 20 }}>
                        Bio:{this.state.doctor.bio}
                    </Text>
                    <Row style={{ marginTop: 25 }}>
                        <Text style={{ color: '#2A2E43', fontFamily: 'Roboto_medium', fontSize: 18, padding: 15, paddingLeft: 20 }}>Select Date:</Text>
                        <DatePicker placeHolderTextStyle={{ color: 'black' }} textStyle={{ color: 'black', paddingRight: 40, fontFamily: 'Roboto_medium', padding: 15, paddingLeft: 40, fontSize: 16 }} defaultDate={new Date()} maximumDate={new Date(2020, 12, 31)} minimumDate={new Date()} animationType='slide' onDateChange={date => this.setState({ date })} />
                    </Row>
                    <Row>
                        <Text style={{ color: '#2A2E43', fontFamily: 'Roboto_medium', fontSize: 18, padding: 15, paddingLeft: 20, paddingTop: 0 }}>Address:</Text>
                        <Text style={{ color: 'black', paddingRight: 20, paddingLeft: 20, fontSize: 16, paddingTop: 1 }}>{this.state.doctor.address}</Text>
                    </Row>
                    <Row>
                        <Text style={{ color: '#2A2E43', fontFamily: 'Roboto_medium', fontSize: 18, padding: 15, paddingLeft: 20, paddingTop: 0 }}>Phone:</Text>
                        <Text style={{ color: 'black', paddingRight: 20, paddingLeft: 20, fontSize: 16, paddingTop: 1 }}>{this.state.doctor.phone}</Text>
                    </Row>
                    <TouchableOpacity style={{ width: '95%', backgroundColor: '#454F63', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20 }} onPress={this.handleBook}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}

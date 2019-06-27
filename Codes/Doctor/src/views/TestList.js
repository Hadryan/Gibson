import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { Container, Content, Text, Spinner, Row, Col } from 'native-base';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Header from '../components/Header';
import * as firebase from 'firebase'
import ResultView from './ResultView';
import ResultNew from './ResultNew';
class TestList extends React.Component {
    state = {
        patient: this.props.navigation.getParam('patient'),
        patientName: this.props.navigation.getParam('patientName'),
        data: [],
        loaded: false
    }
    componentDidMount() {
        firebase.firestore().collection('TestResult').where('patient', '==', this.state.patient).where('doctor', '==', firebase.auth().currentUser.email).orderBy('date').onSnapshot(snap => {
            let data = []
            snap.forEach(doc => {
                data.push({ data: doc.data(), key: doc.id })
            })
            this.setState({ data, loaded: true })
        })
    }
    handleView(item) {
        this.props.navigation.navigate('ResultView', {
            data: item.data
        })
    }
    handleNew() {
        this.props.navigation.navigate('ResultNew', {
            patient: this.state.patient
        })
    }
    renderContent() {
        return <Content style={{ marginTop: 75, marginLeft: 30, marginRight: 30 }}>
            <Row>
                <Col size={70}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#454F63', padding: 5 }}>{this.state.patientName}</Text>
                </Col>
                <Col size={30}>
                    <TouchableOpacity style={{ width: 50, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#78849E', alignSelf: 'flex-end' }} onPress={() => this.handleNew()}>
                        <Text style={{ color: 'white' }}>New</Text>
                    </TouchableOpacity>
                </Col>
            </Row>
            <View style={{ marginTop: 20 }}>
                {this.state.data.map((item, i) => {
                    return <TouchableOpacity key={i} style={{ padding: 5, marginBottom: 10 }} onPress={() => this.handleView(item)}>
                        <Text style={{ fontSize: 18, color: '#78849E' }}>{new Date(item.data.date.seconds * 1000).toLocaleDateString()}</Text>
                    </TouchableOpacity>
                })}
            </View>
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
    TestList,
    ResultView,
    ResultNew
}, {
        headerMode: 'none'
    })
export default createAppContainer(Navigator)
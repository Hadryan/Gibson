import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { Container, Content, Text, Spinner, Col, Row } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
export default class ResultView extends React.Component {
    state = {
        data: this.props.navigation.getParam('data'),
    }
    render() {
        const { data } = this.state
        return (
            <Container>
                <Header title='Test Result' backgroundColor='#78849E' color='white' />
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#454F63', marginLeft: 30, marginTop: 50 }}>{new Date(data.date.seconds * 1000).toLocaleDateString()}</Text>
                <Row style={{ marginTop: 25, height: 35, justifyContent: 'flex-start', paddingTop: 7, borderColor: 'silver', paddingRight: 20, paddingLeft: 20 }}>
                    <Col size={40} />
                    <Col size={20} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#78849E', fontWeight: 'bold' }}>Unit</Text>
                    </Col>
                    <Col size={20} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#78849E', fontWeight: 'bold' }}>Result</Text>
                    </Col>
                    <Col size={20} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#78849E', fontWeight: 'bold' }}>Refrence</Text>
                    </Col>
                </Row>
                <Content style={{ marginTop: 25, }}>
                    <Content style={{ paddingLeft: 30 }}>
                        {data.data.map((item, i) => {
                            return <Row key={i} style={{ marginTop: 10, justifyContent: 'flex-start', marginRight: 20 }}>
                                <Col size={40}>
                                    <Text style={{ fontSize: 16, color: '#78849E' }}>{item.name}</Text>
                                </Col>
                                <Col size={20} style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, color: '#78849E' }}>{item.unit}</Text>
                                </Col>
                                <Col size={20} style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, color: '#78849E' }}>{item.result}</Text>
                                </Col>
                                <Col size={20} style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, color: '#78849E' }}>{item.refrence}</Text>
                                </Col>
                            </Row>
                        })}
                    </Content>
                </Content>
            </Container>
        )
    }
}
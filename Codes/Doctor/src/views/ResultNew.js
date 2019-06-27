import React from 'react';
import { TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Text, Spinner, Row, Col, Input, Form, DatePicker } from 'native-base';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Header from '../components/Header';
import * as firebase from 'firebase'
export default class ResultNew extends React.Component {
    state = {
        name: '',
        data: [],
        date: '',
        unit: '',
        refrence: '',
        result: '',
        patient: this.props.navigation.getParam('patient')
    }
    handleData() {
        const { name, unit, refrence, result, data, date, patient } = this.state
        if (name.length != 0 && result.length != 0) {
            let item = { name: name, unit: unit, refrence: refrence, result: result }
            let items = data
            items.push(item)
            this.setState({ data: items, name: '', refrence: '', result: '', unit: '' })
        } else if (data.length != 0 && date.length != 0) {
            firebase.firestore().collection('TestResult').add({
                patient: patient,
                date: date,
                data: data,
                doctor: firebase.auth().currentUser.email
            }).then(() => {
                this.props.navigation.goBack()
            })
        }
    }
    render() {
        const { name, unit, refrence, result, data } = this.state
        return (
            <Container>
                <Header title='Test Result' backgroundColor='#78849E' color='white' />
                <Content style={{ flex: 1 }} scrollEnabled>
                    <KeyboardAvoidingView behavior='padding' enabled contentContainerStyle={{ flex: 1, }}>
                        <Form style={{ marginTop: 75, marginLeft: 30, marginRight: 30, }}>
                            <Input style={{ width: '95%', minHeight: 45, maxHeight: 200, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Name'
                                value={name} onChangeText={name => this.setState({ name })}
                            />
                            <Row style={{ width: '95%', }}>
                                <Input style={{ width: '30%', height: 45, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Unit'
                                    value={unit} onChangeText={unit => this.setState({ unit })}
                                />
                                <Input style={{ marginLeft: 5, marginRight: 5, height: 45, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Result'
                                    value={result} onChangeText={result => this.setState({ result })}
                                />
                                <Input style={{ width: '30%', height: 45, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Refrence'
                                    value={refrence} onChangeText={refrence => this.setState({ refrence })}
                                />

                            </Row>
                            <View style={{ width: '95%', height: 45, backgroundColor: '#78849E', justifyContent: 'center', paddingRight: 10, marginTop: 10, borderRadius: 8 }}>
                                <DatePicker placeHolderText='Date' textStyle={{ color: 'white', fontSize: 18, }} androidMode='spinner' placeHolderTextStyle={{ color: 'silver', fontSize: 18, }}
                                    onDateChange={date => this.setState({ date })}
                                />
                            </View>
                            <Content style={{ marginTop: 25, width: '95%', maxHeight: '100%', alignSelf: 'center' }}>
                                {data.map((item, i) => {
                                    return <Row key={i} style={{ marginBottom: 10, alignSelf: 'center' }}>
                                        <Col size={40}>
                                            <Text style={{ fontSize: 16, color: '#78849E' }}>{item.name}</Text>
                                        </Col>
                                        <Col size={20}>
                                            <Text style={{ fontSize: 14, color: '#78849E' }}>{item.unit}</Text>
                                        </Col>
                                        <Col size={20}>
                                            <Text style={{ fontSize: 14, color: '#78849E' }}>{item.result}</Text>
                                        </Col>
                                        <Col size={20}>
                                            <Text style={{ fontSize: 14, color: '#78849E' }}>{item.refrence}</Text>
                                        </Col>
                                    </Row>
                                })}
                            </Content>
                            <TouchableOpacity style={{ width: '95%', height: 45, backgroundColor: '#2A2E43', alignItems: 'center', justifyContent: 'center', paddingRight: 10, marginTop: 20, borderRadius: 8, marginBottom: 10 }} onPress={() => this.handleData()}>
                                <Text style={{ color: 'white', }}>SAVE</Text>
                            </TouchableOpacity>
                        </Form>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
        )
    }
}

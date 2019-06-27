import React from 'react';
import { TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Container, Content, Button, Title, Right, Text, Row, Col, Input, Form, Root, DatePicker } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
export default class FinishedView extends React.Component {
  state = {
    data: this.props.navigation.getParam('data'),
    key: this.props.navigation.getParam('key'),
    prescription: [],
    name: '',
    date: '',
    desc: '',
    diagnose: '',
  }
  handleData = () => {
    const { data, diagnose, key, name, desc, date, prescription } = this.state
    if (name.length == 0 && desc.length == 0) {
      firebase.firestore().collection('Booking').doc(key).update({
        diagnose: diagnose,
        finished: true,
        prescription: prescription,
      }).then(() => {
        this.props.navigation.goBack()
      })
    } else {
      let items = prescription
      let item = { name: name, desc: desc, date: date }
      items.push(item)
      this.setState({ prescription: items, name: '', desc: '' })
    }
  }
  handleItem(item) {
    let prescription = this.state.prescription
    prescription.splice(item, 1)
    this.setState({ prescription })
  }
  render() {
    const { data, diagnose, name, desc, prescription } = this.state
    return (
      <Container>
        <Header title='Reservations' backgroundColor='#78849E' color='white' />
        <Content style={{ flex: 1 }} scrollEnabled>
          <KeyboardAvoidingView behavior='padding' enabled contentContainerStyle={{ flex: 1, }}>
            <Form style={{ marginTop: 75, marginLeft: 30, marginRight: 30, }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#454F63' }}>{new Date(data.date.seconds * 1000).toLocaleDateString()}</Text>
              <Input style={{ width: '95%', minHeight: 45, maxHeight: 200, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, color: 'white', marginTop: 10, borderRadius: 8 }} multiline placeholderTextColor='silver' placeholder='Diagnose'
                value={diagnose} onChangeText={diagnose => this.setState({ diagnose })}
              />
              <Text style={{ color: '#78849E', fontWeight: '600', marginTop: 30 }}>Prescription:</Text>
              <Input style={{ width: '95%', height: 45, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Name'
                value={name} onChangeText={name => this.setState({ name })}
              />
              <Input style={{ width: '95%', height: 45, backgroundColor: '#78849E', paddingLeft: 10, paddingRight: 10, color: 'white', marginTop: 10, borderRadius: 8 }} placeholderTextColor='silver' placeholder='Description'
                value={desc} onChangeText={desc => this.setState({ desc })}
              />
              <View style={{ width: '95%', height: 45, backgroundColor: '#78849E', justifyContent: 'center', paddingRight: 10, marginTop: 10, borderRadius: 8 }}>
                <DatePicker placeHolderText='Date' textStyle={{ color: 'white', fontSize: 18, }} androidMode='spinner' placeHolderTextStyle={{ color: 'silver', fontSize: 18, }}
                  onDateChange={date => this.setState({ date })}
                />
              </View>
              <Row style={{ maxHeight: 100, marginTop: 10, flexWrap: 'wrap', width: '95%', maxHeight: '100%' }}>
                {prescription.map((item, i) => {
                  return <TouchableOpacity style={{ padding: 10, margin: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#454F63', borderRadius: 8 }} key={i} onLongPress={() => this.handleItem(i)}>
                    <Text style={{ color: 'white', }}>{item.name}</Text>
                  </TouchableOpacity>
                })}
              </Row>
              <TouchableOpacity style={{ width: '95%', height: 45, backgroundColor: '#2A2E43', alignItems: 'center', justifyContent: 'center', paddingRight: 10, marginTop: 20, borderRadius: 8, marginBottom: 10 }} onPress={() => this.handleData()}>
                <Text style={{ color: 'white', }}>SAVE</Text>
              </TouchableOpacity>
            </Form>
          </KeyboardAvoidingView>
        </Content>
      </Container>
    );
  }
}

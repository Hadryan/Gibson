import React from 'react';
import { TouchableOpacity, View, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions, createStackNavigator, createAppContainer } from 'react-navigation';
import { Container, Content, Button, ActionSheet, Title, Right, Text, Row, Col, Input, Form, Root, Spinner } from 'native-base';
import Header from '../components/Header';
import * as firebase from 'firebase'
import ReservationsView from '../views/ReservationsView';
class Reservations extends React.Component {
    state={
        data:[],
        loaded:false
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            firebase.firestore().collection('Booking').where('doctor', '==', user.email).get().then(snap => {
                let data=[]
                snap.forEach(doc => {
                    data.push(doc.data())
                })
                let result = data.filter(function (a) {
                    return !this[a.patientName] && (this[a.patientName] = true);
                }, Object.create(null));
                this.setState({data:result,loaded:true})
            })
        })
        
    }
    handleView(patient,patientName){
        this.props.navigation.navigate('ReservationsView',{
            patient:patient,
            patientName:patientName
        })
    }
    renderContent(){
        return <Content style={{ marginTop: 75, marginLeft: 30 }}>
        {this.state.data.map((item,i)=>{
            return <TouchableOpacity key={i} style={{padding:5,marginBottom:10}} onPress={()=>this.handleView(item.patient,item.patientName)}>
                <Text style={{fontSize:18,fontWeight:'500',color:'#78849E'}}>{item.patientName}</Text>
            </TouchableOpacity>
        })}
        </Content>
    }
    render() {
        return (
            <Container>
                <Header title='Reservations' backgroundColor='#78849E' color='white' />
                {this.state.loaded?this.renderContent():<Spinner size='large' />}
            </Container>
        )
    }
}

const Navigator=createStackNavigator({
    Reservations,
    ReservationsView
},{
    headerMode:'none'
})

export default createAppContainer(Navigator)
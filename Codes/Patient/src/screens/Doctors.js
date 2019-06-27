import React from 'react';
import { Geolocation, Text, TouchableWithoutFeedback, View, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native';
import { Content, Container, Icon, ListItem, List, Button, Thumbnail, Spinner } from 'native-base';
require('firebase/firestore')
import * as firebase from 'firebase'
import { GeoFire } from 'geofire';
import mapStyle from './mapStyle.json'
import Ionicons from '@expo/vector-icons/Ionicons';
import { MapView } from 'expo'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Booking from './Booking.js';

class Doctors extends React.Component {
    state = {
        toggled: false,
        counter: null,
        data: [],
        nearby: [],
        distance: null,
        coordinate: {
            latitude: 0,
            longitude: 0,
            longitudeDelta: 0,
            latitudeDelta: 0,
        }
    }
    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(pos => {
            let coordinate = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.015, longitudeDelta: 0.0121, }
            this.setState({ coordinate })
            this.getNearby()
        })
    }
    getNearby() {
        const { coordinate } = this.state
        var firebaseRef = firebase.database().ref('Doctors');
        var geoFire = new GeoFire(firebaseRef);
        var geoQuery = geoFire.query({
            center: [coordinate.latitude, coordinate.longitude],
            radius: 2
        })
        let nearby = []
        geoQuery.on("key_entered", (key, location, distance) => {
            nearby.push(key)
            this.setState({ nearby, distance: distance * 1000 })
        })
        geoQuery.on('ready', () => {
            if (nearby.length != 0) {
                this.getData()
            }
        })
    }
    getData() {
        const db = firebase.firestore().collection('Doctors')
        let refs = []
        this.state.nearby.map(item => {
            refs.push(db.doc(item).get())
        })
        const data = Promise.all(refs)
        data.then(res => {
            let data = []
            res.map(snap => {
                data.push(snap.data());
            })
            this.setState({ data });
        })
    }
    handleCall(item) {
        Linking.openURL(`tel:${item}`)
    }
    handleBook(item) {
        this.props.navigation.navigate('Booking', {
            doctor: item,
        })
    }
    renderDoctorsSm() {
        return <TouchableWithoutFeedback onPress={() => this.setState({ toggled: !this.state.toggled })}>
            <View style={{ position: 'absolute', height: 50, width: '100%', backgroundColor: '#2A2E43', bottom: -5, borderRadius: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ paddingLeft: 30, paddingTop: 10, flexDirection: 'row' }}>
                        <Ionicons name='ios-arrow-up' size={20} color='white' />
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '400', paddingLeft: 10 }}>Nearby Doctors</Text>
                    </View>
                    <Text style={{ color: 'white', fontSize: 32, paddingLeft: '45%', fontWeight: '100', opacity: 0.5 }}>{this.state.nearby.length}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }
    renderDoctorsLg() {
        return <View style={{ position: 'absolute', height: 300, width: '100%', backgroundColor: '#2A2E43', bottom: -5, borderRadius: 8 }}>
            <View>
                <View style={{ paddingLeft: 30, paddingTop: 10, flexDirection: 'row' }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '400' }}>{this.state.distance.toFixed(0)}m away</Text>
                </View>
                <ScrollView style={{ paddingLeft: 40, paddingTop: 10, height: 200, marginBottom: 10 }}>
                    {this.state.data.length != 0 ? this.state.data.map((item, i) => {
                        return <View key={i} style={{ flexDirection: 'row', margin: 10 }}>
                            <Thumbnail square source={{ uri: item.thumbnail }} style={{ borderRadius: 10, height: 40, width: 40, marginRight: 10 }} />
                            <View style={{ width: 100 }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                                <Text style={{ color: item.state ? '#3497FD' : '#78849E', fontSize: 12, fontWeight: '100' }}>{item.state ? 'online' : 'offline'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 40, marginTop: 2 }}>
                                <TouchableOpacity style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#353A50', borderRadius: 10 }} onPress={() => this.handleCall(item.phone)}>
                                    <Ionicons name='ios-call' color='#78849E' size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#353A50', borderRadius: 10, marginLeft: 10 }} onPress={() => this.handleBook(item)}>
                                    <Ionicons name='ios-document' color='#78849E' size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }) : <Spinner color='gray' style={{ alignSelf: 'center' }} />}
                </ScrollView>
                <Button block style={{ backgroundColor: '#454F63', width: '50%', alignSelf: 'center', borderRadius: 8, bottom: 0 }} onPress={() => this.setState({ toggled: !this.state.toggled })}>
                    <Text style={{ color: 'white' }}>Cancel</Text>
                </Button>
            </View>
        </View>
    }

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
                    <MapView
                        style={{ flex: 1, width: '100%', height: '100%' }}
                        region={this.state.coordinate}
                        customMapStyle={mapStyle}
                    >
                        <MapView.Marker coordinate={this.state.coordinate} tracksViewChanges={false}>
                        </MapView.Marker>
                        {this.state.data.length != 0 ? this.state.data.map((item, i) => {
                            return <MapView.Marker key={i} coordinate={item.coordinate} >
                                <Ionicons name='ios-radio-button-on' size={20} color={item.state ? '#3497FD' : '#78849E'} tracksViewChanges={false} />
                            </MapView.Marker>
                        }) : null}
                    </MapView>
                </View>
                {this.state.toggled ? this.renderDoctorsLg() : this.renderDoctorsSm()}
            </Container>
        )
    }
}
const Navigator = createStackNavigator({
    Doctors,
    Booking
}, {
        headerMode: 'none'
    })
export default createAppContainer(Navigator)
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import * as firebase from 'firebase'
import { MapView } from 'expo'
import { Container, Button } from 'native-base';
import { GeoFire } from 'geofire';
import mapStyle from './mapStyle.json'
import Ionicons from '@expo/vector-icons/Ionicons';
require('firebase/firestore')
import Header from '../components/Header';


class Emergency extends React.Component {
  state = {
    coordinate: {
      latitude: 0,
      longitude: 0,
      longitudeDelta: 0,
      latitudeDelta: 0,
    },
    nearby: [],
    nearByData: null,
    requestId: '',
    nearestCar: null,
    searchRadius: 50,
    interval: null,
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.entryPoint()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async entryPoint() {
    await navigator.geolocation.getCurrentPosition(pos => {
      let coordinate = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
      this.setState({ coordinate })
      this.getNearby()
    })
  }

  getNearby = async () => {
    const { coordinate } = this.state
    var firebaseRef = firebase.database().ref('Emergency');
    var geoFire = new GeoFire(firebaseRef);
    var geoQuery = geoFire.query({
      center: [coordinate.latitude, coordinate.longitude],
      radius: this.state.searchRadius
    })

    let nearby = [];
    geoQuery.on("key_entered", (key, location, distance) => {
      nearby.push({ key: key, distance: (distance * 1000), location: location })
      this.setState({ nearby })
    })

    geoQuery.on('ready', () => {
      if (nearby.length == null || nearby.length == 0) {
        let searchRadius = this.state.searchRadius + 10
        console.log('empty nearby, search in range' + searchRadius)
        this.setState({ searchRadius })
        if (searchRadius <= 100) this.getNearby();
      }

      if (nearby.length != null) {
        nearby.sort(function (a, b) {
          return parseInt(a.distance) - parseInt(b.distance);
        })
        this.requestData()
      }
    })
  }

  requestData = () => {
    const { nearby } = this.state
    const db = firebase.firestore().collection('Emergency')
    let refs = []
    nearby.map(item => {
      refs.push(db.doc(item.key).get())
    })
    let data = Promise.all(refs)
    data.then(res => {
      let dt = []
      res.map(snap => {
        if (snap.data() != undefined && snap.data().state) {
          dt.push(snap.data())
        }
      })
      if (dt.length != null) {
        this.setState({ nearByData: dt });
        this.process();
      }
    })
  }

  process = () => {
    let allNearBy = this.state.nearByData

    if (allNearBy.length != null && allNearBy.length > 0) {
      let nearestCar = allNearBy[0];
      allNearBy.splice(0, 1);
      this.setState({ nearestCar: nearestCar, nearByData: allNearBy })
      this.handleRequest();
    } else {
      alert('Sorry no ambulace cars are available at current time')
    }
  }

  handleRequest = () => {

    let data = this.state.nearestCar
    console.log(data)
    if (data == null || !data.state) {
      alert('Nearest car: ' + data.carId + 'is not available now!\nSearching for another one...')
      this.getNearby();
    }

    if (this.state.requestId != '') {
      alert('There is a pending request already!')
      return;
    }

    let usr = firebase.auth().currentUser.email
    firebase.firestore().collection('Requesting').add({
      Date: new Date().getTime(),
      employerUsername: this.state.nearestCar.email,
      location: this.state.coordinate,
      username: usr,
      finished: false,
      accepted: false,
      canceled: false,
      carId: this.state.nearestCar.carId
    }).then((doc) => {
      this.setState({ requestId: doc.id })
      alert('Request sent to nearest ambulance car! \nCar ID: (' + this.state.nearestCar.carId +
        ')\nWorker Name: (' + this.state.nearestCar.name + ')')
      this.intervalRun()
    })
  }

  intervalRun = () => {
    const interval = setInterval(() => {
      let ref = firebase.firestore().collection('Requesting').doc(this.state.requestId)
        .get().then(snap => {
          if (snap == undefined) {
            console.log('snap is undefined -##-');
            return;
          }
          this.checkCurrentRequest(snap.data())
        })
    }, 5000);
    this.setState({ interval })
  }

  clearTheInterval = () => {
    let interval = this.state.interval;
    clearInterval(interval);
    this.setState({ requestId: '', interval: null })
  }

  checkCurrentRequest = (request) => {

    if (this.state.requestId == '' || request.accepted == undefined) {
      this.clearTheInterval();
      return;
    }

    if (request.accepted || request.finished) {
      alert('Your Request is ' + (request.finished ? 'finished' : 'accepted') +
       '! by car (' + request.carId + ')')
      this.clearTheInterval()
    }
    if (request.canceled) {
      alert('Request to car: (' + request.carId + 
        ') is canceled!\nSending request to another nearest car.')
      this.clearTheInterval()
      this.process(); // search again..
    }
  }

  handleCancel = () => {
    if (this.state.requestId == '') {
      alert('No requests found!');
      return;
    }
    firebase.firestore().collection('Requesting').doc(this.state.requestId).delete().then(() => {
      alert('Request canceled!')
      this.clearTheInterval()
      this.setState({ requestId: '', interval: null })
      this.props.navigation.navigate('Home');
    })
  }

  render() {
    return (
      <Container >
        <View style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
          <MapView
            customMapStyle={mapStyle}
            region={this.state.coordinate}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <MapView.Marker coordinate={this.state.coordinate} tracksViewChanges={false} />
            {this.state.nearby.map(item => {
              return <MapView.Marker
                key={item.key}
                title={item.key}
                coordinate={{ latitude: item.location[0], longitude: item.location[1] }}>
                <Ionicons name='md-medkit' size={20} color='#FF4F4F' />
              </MapView.Marker>
            })}
          </MapView>
        </View>
        <TouchableOpacity style={{ alignSelf: 'center', position: 'absolute', marginTop: 50, width: '90%', backgroundColor: '#FF4F4F', justifyContent: 'center', alignItems: 'center', borderRadius: 12, height: 50, }} onPress={() => this.handleCancel()}>
          <Text style={{ color: 'white' }}>Cancel</Text>
        </TouchableOpacity>
        
        {/* <Text style={{ alignSelf: 'center', position: 'absolute', textAlign: 'center' ,marginTop: 110, width: '90%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 12, height: 50, color: 'white', }}>
          current request details here..
        </Text> */}
        
      </Container>
    );
  }
}
const Navigator = createStackNavigator({
  Emergency,
}, {
    headerMode: 'none'
  })
export default createAppContainer(Navigator)


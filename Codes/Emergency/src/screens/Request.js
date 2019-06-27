import React from 'react';
import { StyleSheet, Text, View,Geolocation } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation'
import * as firebase from 'firebase'
import {MapView } from 'expo'
import { Container,Button } from 'native-base';
import { GeoFire } from 'geofire';
require('firebase/firestore')
import Ionicons from '@expo/vector-icons/Ionicons';
import MapViewDirections from 'react-native-maps-directions'

class Request extends React.Component {
    state = {
        currentLocation:this.props.navigation.getParam('currentLocation'),
        target:this.props.navigation.getParam('target'),
    }
    finishRequest(){
        let docRef = firebase.firestore().collection('Requesting').doc(this.state.target.key);
        docRef.get().then(function (doc) {
            console.log(doc.data())
            docRef.update({'finished': true, 'accepted': true, 'canceled': false})
            alert('Finished!')
        });
    }
render() {
    return (
      <Container style={{backgroundColor:'#5c0000'}}>
        <View style={{flex:1,width:'100%',height:'100%',position:'absolute',zIndex:0}}>
            <MapView
                region={this.state.currentLocation}
                style={{flex:1,width:'100%',height:'100%'}}
            >

            <MapView.Marker coordinate={this.state.currentLocation} tracksViewChanges={true}>
                <Ionicons name='md-pin' size={40} color='black' />
            </MapView.Marker>

            <MapView.Marker coordinate={this.state.target.location} tracksViewChanges={true}>
                <Ionicons name='md-pin' size={40} color='red'  />
            </MapView.Marker>

            <MapViewDirections
                origin={this.state.currentLocation}
                destination={this.state.target.location}
                apikey={'AIzaSyBwn4N16Vhebix3O6JxF2EmGJ8oYCWSH6w'}
                strokeWidth={5}
                strokeColor="hotpink"
                optimizeWaypoints={true}
            />

            </MapView>
        </View>
      <Button success style={{flex:1,alignItems:'center',justifyContent:'center',alignSelf:'center',position:'absolute',marginTop:50,width:'90%'}} onPress={()=>this.finishRequest()}>
          <Text style={{color:'white',fontSize:16,fontWeight:'400'}}>Finished</Text>
      </Button>
      </Container>
    );
  }
}

const Navigator=createStackNavigator({
    Request,
},{
    headerMode:'none'
})
export default createAppContainer(Navigator)

import React from 'react';
import { ScrollView, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase'
import { Container, Button, Input, Form, Thumbnail, View, Switch, Row, Col } from 'native-base';
import Header from '../components/Header';
import { ImageManipulator, ImagePicker, Permissions } from 'expo';
import PercentageCircle from 'react-native-percentage-circle';
import uuid from 'react-native-uuid';
import { GeoFire } from 'geofire';

export default class Profile extends React.Component {
    state = {
        key: '',
        phone: '',
        address: '',
        bio: '',
        coordinate: {},
        thumbnail: null,
        newThumbnail: null,
        percent: 0,
        state: false
    }
    async componentDidMount() {
        let email = firebase.auth().currentUser.email
        firebase.firestore().collection('Doctors').where('email', '==', email).onSnapshot(snap => {
            this.setState({ key: snap.docs[0].id, phone: snap.docs[0].data().phone, address: snap.docs[0].data().address, bio: snap.docs[0].data().bio, coordinate: snap.docs[0].data().coordinate, thumbnail: snap.docs[0].data().thumbnail, state: snap.docs[0].data().state })
        })
    }
    _urlToBlob(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob'; // convert type
            xhr.send();
        })
    }
    handleLocation = async () => {
        await navigator.geolocation.getCurrentPosition(pos => {
            let coordinate = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
            this.setState({ coordinate })
            this.getNearby()
        })
    }
    reduceImageAsync(uri) {
        return ImageManipulator.manipulate(uri, [{ resize: { width: 500 } }], {
            compress: 0.5,
        });
    }
    handleUpdate = async () => {
        const { key, coordinate, phone, bio, address, thumbnail, newThumbnail } = this.state
        if (newThumbnail != null) {

            firebase.firestore().collection('Doctors').doc(key).update({
                coordinate: coordinate,
                address: address,
                phone: phone,
                bio: bio,
                thumbnail: newThumbnail
            }).then(() => {
                this.props.navigation.goBack()
            })
        } else {
            var firebaseRef = firebase.database().ref('Doctors');
            var geoFire = new GeoFire(firebaseRef);
            geoFire.set(key, [coordinate.latitude, coordinate.longitude])
            firebase.firestore().collection('Doctors').doc(key).update({
                coordinate: coordinate,
                address: address,
                phone: phone,
                bio: bio,
                thumbnail: thumbnail
            }).then(() => {
                this.props.navigation.goBack()
            })
        }
    }
    handleChoosePhoto = () => {
        this._selectPhoto()
    }
    _selectPhoto = async () => {
        const status = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (status) {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled) {
                this.setState({ thumbnail: result.uri })
                this.shrinkAsync(result.uri).then(res => {
                    this.uploadPhoto(res.uri).then(save => {
                        this.setState({ newThumbnail: save })
                    })
                })
            }
        }
    };
    async shrinkAsync(uri) {
        const img = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 500 } }], {
            compress: 0.5,
        });
        return img
    }
    async uploadPhoto(uri) {
        return new Promise(async (res, rej) => {
            var name = uuid.v1();
            const blob = await this._urlToBlob(uri)
            const ref = firebase.storage().ref(name);
            const unsubscribe = ref.put(blob).on(
                'state_changed',
                state => {
                    this.setState({ percent: ((state.bytesTransferred / state.totalBytes) * 100).toFixed() })
                },
                err => {
                    unsubscribe();
                    rej(err);
                },
                async () => {

                    unsubscribe();
                    const url = await ref.getDownloadURL();
                    res(url);
                },
            );
        });
    }
    toggleState(state) {
        let emRef = firebase.firestore().collection('Doctors').doc(this.state.key);
        emRef.update({ 'state': state })
    }
    render() {
        return (
            <Container>
                <Header title='Profile' backgroundColor='#78849E' color='white' />
                <ScrollView style={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior='padding' enabled contentContainerStyle={{ flex: 1, }}>
                        <Form style={{ marginTop: 25, width: '100%', }}>
                            <Row style={{ margin: 20, marginTop: 0, height: 20, }}>
                                <Col>
                                    <Switch value={this.state.state} style={{ alignSelf: 'flex-start', marginTop: 0 }}
                                        onValueChange={state => this.toggleState(state)}
                                    />
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                            <View style={{ alignSelf: 'center', marginTop: -35 }}>
                                <PercentageCircle radius={32} borderWidth={3} innerColor='transparent' percent={this.state.percent} color={"#3498db"}>
                                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.handleChoosePhoto}>
                                        <Thumbnail source={{ uri: this.state.thumbnail }} />
                                    </TouchableOpacity>
                                </PercentageCircle>
                            </View>
                            <Input placeholder='Phone' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={phone => this.setState({ phone })} value={this.state.phone} />
                            <Input placeholder='Address' placeholderTextColor='#E3E6EE' style={{ width: '90%', height: 52, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} onChangeText={address => this.setState({ address })} value={this.state.address} />
                            <Input placeholder='Bio' placeholderTextColor='#E3E6EE' style={{ width: '90%', minHeight: 52, maxHeight: 100, padding: 15, paddingLeft: 20, paddingRight: 20, fontFamily: 'Roboto_medium', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25, color: 'white' }} multiline onChangeText={bio => this.setState({ bio })} value={this.state.bio} />
                            <TouchableOpacity style={{ width: '50%', height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#78849E', borderRadius: 10, alignSelf: 'center', marginTop: 25 }} onPress={this.handleLocation}>
                                <Text style={{ color: 'white', }}>Get current location</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: '90%', height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2E43', borderRadius: 10, alignSelf: 'center', marginTop: 50 }} onPress={this.handleUpdate}>
                                <Text style={{ color: 'white', }}>UPDATE</Text>
                            </TouchableOpacity>
                        </Form>
                    </KeyboardAvoidingView>
                </ScrollView>

            </Container>
        )
    }
}

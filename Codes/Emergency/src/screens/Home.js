import React from "react";
import { View, TouchableOpacity, Geolocation } from "react-native";
import * as firebase from "firebase";
import { Container, Content, Row, Text, Col, Button } from "native-base";
import Header from "../components/Header";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Request from "./Request";
import History from "./History";

class Home extends React.Component {
  state = {
    coordinate: {
      latitude: 0,
      longitude: 0,
      longitudeDelta: 0,
      latitudeDelta: 0
    },
    data: [],
    email: null,
    user: {},
    interval: null
  };
  async componentDidMount() {
    let email = firebase.auth().currentUser.email;

    console.log(email);

    let coordinate = {};
    await navigator.geolocation.getCurrentPosition(pos => {
      coordinate = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      };
      this.setState({ coordinate, email });
      this.checkUser();
      console.log("geo..");
      let interval = setInterval(() => {
        this.updateRequests();
      }, 4000);
      this.setState({ interval });
    });
  }
  checkUser() {
    let interval = this.state.interval;

    let x = firebase
      .firestore()
      .collection("Emergency")
      .where("email", "==", this.state.email)
      .get()
      .then(snap => {
        let usr = null;
        snap.forEach(doc => {
          usr = doc.data();
        });
        if (usr == null) {
          alert("You are not an Emergency worker!");
          clearInterval(interval);
          this.setState({ interval: null });
          firebase
            .auth()
            .signOut()
            .then(() => this.props.navigation.navigate("Login"));
        } else {
          let user = usr;
          this.setState({ user });
          this.updateRequests();
        }
      });
  }

  updateRequests() {
    let ref = firebase.firestore().collection("Requesting");
    ref.orderBy("date");
    ref
      .where("employerUsername", "==", this.state.user.email)
      .get()
      .then(snap => {
        let data = [];
        snap.forEach(doc => {
          data.push({ ...doc.data(), ...{ key: doc.id } });
        });
        let state = data.state;
        this.setState({ data });
      });
  }

  handleView = item => {
    this.props.navigation.navigate("Request", {
      currentLocation: this.state.coordinate,
      target: item
    });
  };
  toggleState() {
    if (this.state.user.name == undefined) return;

    let emRef = firebase
      .firestore()
      .collection("Emergency")
      .doc(this.state.user.name);
    emRef.get().then(snap => {
      let state = !snap.data().state;
      this.state.user.state = state;
      this.setState({ user: this.state.user });
      emRef.update({ state: state });
    });
  }
  handleAccept(item) {
    let ref = firebase
      .firestore()
      .collection("Requesting")
      .doc(item.key);
    ref.get().then(snap => {
      ref.update({ accepted: true, canceled: false });
      alert("Request Accepted!");
    });
  }
  handleCancel(item) {
    let ref = firebase
      .firestore()
      .collection("Requesting")
      .doc(item.key);
    ref.get().then(snap => {
      ref.update({ finished: true, accepted: false, canceled: true });
      alert("Request Canceled!");
    });
  }
  getActiveRequests() {
    let ret = [];
    if (this.state.data == undefined || !this.state.data.length) return [];

    this.state.data.map((item, i) => {
      if (!item.finished && !item.cancel) ret.push(item);
    });
    return ret;
  }
  render() {
    return (
      <Container>
        <Header
          title="REQUESTS"
          backgroundColor="#5c0000"
          color="white"
          btn={() => {
            this.props.navigation.goBack();
          }}
        />
        <Content style={{ marginTop: 10 }}>
          <Row
            style={{
              padding: 5,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              color: "black",
              margin: 25,
              backgroundColor: "#efeea1",
              fontSize: 16,
              fontWeight: "400",
              width: "100%"
            }}
          >
            <Col size={5} />
            <Col size={35}>
              <Text
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontSize: 16,
                  fontWeight: "400"
                }}
              >
                You are [ {this.state.user.state ? "ONLINE" : "OFFLINE"} ]
              </Text>
            </Col>
            <Col size={60}>
              <Row>
                <Button info onPress={() => this.toggleState()}>
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "400" }}
                  >
                    Be {this.state.user.state ? "Offline" : "Online"}
                  </Text>
                </Button>
                <Button
                  info
                  style={{ marginLeft: 15 }}
                  onPress={() =>
                    this.props.navigation.navigate("History", {
                      data: this.state.data
                    })
                  }
                >
                  <Text
                    style={{ color: "green", fontSize: 16, fontWeight: "400" }}
                  >
                    History
                  </Text>
                </Button>
                {/*<Ionicons style={{marginLeft:10, marginTop:10}} name='ios-refresh-circle' color={this.props.color} size={25} onPress={()=>this.updateRequests()} />*/}
              </Row>
            </Col>
          </Row>
          <Text
            style={{
              color: "black",
              fontSize: 16,
              marginBottom: 5,
              fontWeight: "400",
              width: "100%"
            }}
          >
            You have {this.getActiveRequests().length} request
            {this.state.data.length > 1 ? "s" : ""}
          </Text>
          {this.getActiveRequests().map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={{
                  padding: 5,
                  marginTop: 15,
                  backgroundColor: "#D2D2D2",
                  width: "100%"
                }}
                onPress={() => this.handleView(item)}
              >
                <Row>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 16,
                      color: "#2A2E43",
                      fontWeight: "300"
                    }}
                  >
                    Position: lat:{item.location.latitude}, long:
                    {item.location.longitude}{" "}
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 16,
                      color: "#2A2E43",
                      fontWeight: "300"
                    }}
                  >
                    State: {item.accepted ? "Accepted" : "Pending"}
                  </Text>
                </Row>
                <Row>
                  <Col size={20} />
                  <Col size={20}>
                    <Button
                      default
                      onPress={() => this.handleAccept(item)}
                      disabled={item.accepted}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "400"
                        }}
                      >
                        Accept
                      </Text>
                    </Button>
                  </Col>
                  <Col size={20}>
                    <Button danger onPress={() => this.handleCancel(item)}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "400"
                        }}
                      >
                        Cancel
                      </Text>
                    </Button>
                  </Col>
                </Row>
              </TouchableOpacity>
            );
          })}
        </Content>
      </Container>
    );
  }
}
const Navigator = createStackNavigator(
  {
    Home,
    Request,
    History
  },
  {
    headerMode: "none"
  }
);
export default createAppContainer(Navigator);

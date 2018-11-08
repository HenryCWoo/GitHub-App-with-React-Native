import React, { Component } from "react";
import GithubButton from "./GithubButton";
import { Image, Dimensions, Alert } from "react-native";
import { View, Item, Input, Icon, Button, Text, CheckBox } from "native-base";
import {
  _storeData,
  _retrieveData,
  storageKeys
} from "../utils/AsyncStorageOps";
const base64 = require("base-64");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      user: null,
      rememberMe: false,
      username: ""
    };

    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    // Reset authentication
    this.setState({ user: null, basicCredentials: null });

    // Check to see if user wanted to username to be remembered
    _retrieveData(storageKeys.USERNAME).then(username => {
      if (username) {
        this.setState({ rememberMe: true, username: username });
      }
    });

    // Check to see if token is still valid from older session
    _retrieveData(storageKeys.AUTH_CODE_KEY).then(token => {
      this.getUser(token);
      this.setState({ accessToken: token });
    });
  }

  componentDidUpdate() {
    if (this.state.user && this.state.basicCredentials) {
      let user = this.state.user;
      this.setState({ user: null });
      this.props.navigation.navigate("ProfileScreen", {
        user: user,
        basicCredentials: this.state.basicCredentials
      });
    } else if (this.state.user && this.state.accessToken) {
      let user = this.state.user;
      this.setState({ user: null });
      this.props.navigation.navigate("ProfileScreen", {
        user: user,
        accessToken: this.state.accessToken
      });
    }
  }

  static navigationOptions = () => {
    return {
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 }
    };
  };

  octocatBubble() {
    // Animated octocat on login screen
    let imageHeight = dimensions.height * 0.3;
    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: imageHeight,
          marginTop: 16
        }}>
        <Image
          source={{
            uri:
              "https://blog.rapidapi.com/wp-content/uploads/2017/01/octocat.gif"
          }}
          style={{
            borderRadius: imageHeight / 2,
            height: imageHeight,
            margin: dimensions.height * 0.05
          }}
        />
      </View>
    );
  }

  renderBottomBackground() {
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: "#f6cab0",
          alignSelf: "center",
          top: dimensions.height * 0.5,
          width: dimensions.width * 2,
          height: dimensions.height * 0.8,
          transform: [{ rotate: "340deg" }]
        }}
      />
    );
  }

  basicAuthLogin(username, password) {
    let credentials = base64.encode(`${username}:${password}`);
    let headers = new Headers();
    headers.append("Authorization", "Basic " + credentials);

    fetch("https://api.github.com/user", {
      method: "GET",
      headers: headers
    })
      .then(response => response.json())
      .then(userInfo => {
        if (userInfo.hasOwnProperty("login")) {
          this.setState({
            user: userInfo["login"],
            basicCredentials: credentials
          });
          // If remember me checkbox is checked, store only the username for next time
          if (this.state.rememberMe) {
            _storeData(storageKeys.USERNAME, username);
          } else {
            _storeData(storageKeys.USERNAME, "");
          }
        } else {
          // Failed login attempt
          Alert.alert("Invalid username\nand/or password!", "Try again", [
            { text: "Ok" }
          ]);
        }
      });
  }

  getUser(token) {
    // Auth2.0 getUser
    fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(response => response.json())
      .then(userInfo => this.setState({ user: userInfo["login"] }));
  }

  loginComponent() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          paddingTop: dimensions.height * 0.1,
          margin: 36
        }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>
          Hub App with React Native
        </Text>
        <Item>
          <Icon active type="Feather" name="user" />
          <Input
            placeholder="Username"
            autoCorrect={false}
            autoCapitalize="none"
            value={this.state.username ? this.state.username : ""}
            onChangeText={textValue => this.setState({ username: textValue })}
          />
        </Item>
        <Item>
          <Icon active type="Feather" name="lock" />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={textValue => this.setState({ password: textValue })}
          />
        </Item>
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <CheckBox
            checked={this.state.rememberMe}
            onPress={() => {
              this.setState({ rememberMe: !this.state.rememberMe });
            }}
            color="#b1594c"
            style={{ marginRight: 16 }}
          />
          <View>
            <Text>Remember me</Text>
          </View>
        </View>
        <View style={{ marginBottom: 16 }} />
        <View style={{ marginBottom: 16 }}>
          <Button
            onPress={() => {
              this.basicAuthLogin(this.state.username, this.state.password);
            }}
            style={{
              backgroundColor: "#b1594c",
              width: buttonDim,
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Text
              style={{
                color: "white",
                textAlign: "center"
              }}>
              Login
            </Text>
          </Button>
        </View>
        <GithubButton getUser={this.getUser} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#97daf1" }}>
        {this.octocatBubble()}
        {this.renderBottomBackground()}
        {this.loginComponent()}
      </View>
    );
  }
}

const dimensions = Dimensions.get("window");
export const buttonDim = dimensions.width * 0.6;

import React, { Component } from "react";
import { Linking, Image, Dimensions } from "react-native";
import { Text, Button, Icon, View } from "native-base";
import { _storeData, _retrieveData } from "../utils/AsyncStorageOps";
import { storageKeys } from "../utils/AsyncStorageOps";

const client_id = "4fd034b053759d7f1112";
const client_secret = "";

export default class GithubButton extends Component {
  constructor() {
    super();
    this.state = {};
  }

  authenticate() {
    // Sends the user to the Github login page
    getCode = responseUrl => {
      let codePosition = responseUrl.search("code=");
      if (codePosition > 0) {
        let codeResult = responseUrl.slice(codePosition + 5);
        return codeResult;
      }
    };

    let url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`;
    Linking.openURL(url);
    Linking.addEventListener("url", responseUrl => {
      let code = getCode(responseUrl.url);
      this.login(code);
    });
  }

  login(authCode) {
    // Gets the access token given the code from #authenticate()
    fetch(
      `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${authCode}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let accessToken = responseJson.access_token;
        if (accessToken) {
          _storeData(storageKeys.AUTH_CODE_KEY, accessToken);
        }
        return accessToken;
      })
      .then(token => this.props.getUser(token));
  }

  render() {
    return (
      <View>
        <Button
          iconLeft
          onPress={() => this.authenticate()}
          style={{
            backgroundColor: "#282828",
            width: buttonDim,
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Icon type="FontAwesome" name="github" style={{ color: "white" }} />
          <Text style={{ color: "white" }}>Login with GitHub</Text>
        </Button>
      </View>
    );
  }
}

const dimensions = Dimensions.get("window");
export const buttonDim = dimensions.width * 0.6;

import React, { Component } from "react";
import { Text, View, StatusBar } from "react-native";
// import HomeTabScreen from "./src/HomeScreen/index";
import ProfileScreen from "./src/HomeScreen/ProfileScreen/ProfileScreen";

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ProfileScreen />
        <StatusBar
          animated={true}
          translucent={true}
          barStyle="light-content"
        />
      </View>
    );
  }
}

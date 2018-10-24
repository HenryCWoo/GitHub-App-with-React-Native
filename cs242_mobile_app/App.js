import React, { Component } from "react";
import { Text, View } from "react-native";
import HomeTabScreen from "./src/HomeScreen/index";

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <HomeTabScreen />
      </View>
    );
  }
}

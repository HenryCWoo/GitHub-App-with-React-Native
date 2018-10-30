import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import ProfileScreen from "./src/HomeScreen/ProfileScreen/ProfileDescriptor/ProfileScreen";

console.disableYellowBox = true;
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

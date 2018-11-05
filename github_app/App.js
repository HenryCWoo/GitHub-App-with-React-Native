import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import ProfileScreen from "./src/HomeScreen/ProfileScreen/ProfileScreen";
import LoginScreen from "./src/LoginScreen/LoginScreen";
import { StackNavigator } from "react-navigation";

console.disableYellowBox = true;
export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <RootStack />
        <StatusBar
          animated={true}
          translucent={true}
          barStyle="light-content"
        />
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen
    },
    ProfileScreen: {
      screen: ProfileScreen
    }
  },
  {
    initialRouteName: "LoginScreen"
  }
);

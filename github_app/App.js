import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import ProfileScreen from "./src/Components/HomeScreen/ProfileScreen/ProfileScreen";
import LoginScreen from "./src/Components/LoginScreen/LoginScreen";
import SearchScreen from "./src/Components/SearchScreen/SearchScreen";
import RepoScreen from "./src/Components/HomeScreen/RepoScreen/RepoScreen";
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
    },
    SearchScreen: {
      screen: SearchScreen
    },
    RepoScreen: {
      screen: RepoScreen
    }
  },
  {
    initialRouteName: "LoginScreen"
  }
);

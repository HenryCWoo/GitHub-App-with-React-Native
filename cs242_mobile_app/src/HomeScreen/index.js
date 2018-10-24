import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { createBottomTabNavigator } from "react-navigation";
import ProfileScreen from "./ProfileScreen/ProfileScreen";

export default (HomeTabScreen = createBottomTabNavigator({
  Profile: ProfileScreen
}));

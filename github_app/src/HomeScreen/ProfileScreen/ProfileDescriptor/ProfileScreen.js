import React, { Component } from "react";
import { View, ScrollView, Dimensions, Text, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";
import PublicRepoList from "../PublicRepoList";
import UsersList from "../UsersList";
import UpperScreen from "./UpperScreen";

export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      user: "HenryCWoo",
      prevUser: null,
      githubUser: null
    };

    this.changeUserHandler = this.changeUserHandler.bind(this);
  }

  getGithubUser() {
    fetch(`https://api.github.com/users/${this.state.user}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson =>
        this.setState({
          githubUser: responseJson,
          prevUser: this.state.user
        })
      );
  }

  componentDidMount() {
    this.getGithubUser();
  }

  componentDidUpdate() {
    if (this.state.user !== this.state.prevUser) {
      this.getGithubUser();
    }
  }

  changeUserHandler(newUser) {
    this.setState({ user: newUser });
  }

  renderTabs() {
    if (this.state.githubUser) {
      var createTabHeaders = (githubIndex, headerText) => {
        return (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white" }}>{githubIndex}</Text>
            <Text style={{ color: "grey", fontSize: 12 }}>{headerText}</Text>
          </View>
        );
      };

      return (
        <View>
          <Tabs
            renderTabBar={() => (
              <ScrollableTab
                style={{ backgroundColor: "transparent", height: 80 }}
              />
            )}>
            {[
              [
                "public_repos",
                "PUBLIC REPOS",
                <PublicRepoList user={this.state.user} />
              ],
              [
                "followers",
                "FOLLOWERS",
                <UsersList
                  user={this.state.user}
                  getUserType="followers"
                  changeUserHandler={this.changeUserHandler}
                />
              ],
              [
                "following",
                "FOLLOWING",
                <UsersList
                  user={this.state.user}
                  getUserType="following"
                  changeUserHandler={this.changeUserHandler.bind(this)}
                />
              ]
            ].map((itemSet, index) => (
              <Tab
                key={"tabheader" + index}
                heading={
                  <TabHeading
                    style={{ backgroundColor: "transparent", flex: 1 }}>
                    {createTabHeaders(
                      this.state.githubUser[itemSet[0]],
                      itemSet[1]
                    )}
                  </TabHeading>
                }>
                {itemSet[2]}
              </Tab>
            ))}
          </Tabs>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="transparent"
          outerContainerStyles={styles.outerContainer}
          centerComponent={{
            text: "Profile",
            style: { color: "white" }
          }}
        />
        <ScrollView>
          {this.state.githubUser ? (
            <UpperScreen githubUser={this.state.githubUser} />
          ) : (
            <View />
          )}
          {this.renderTabs()}
        </ScrollView>
      </View>
    );
  }
}

const dimensions = Dimensions.get("window");
const backgroundImageHeight = Math.round(dimensions.width * 2.5);
const backgroundImageWidth = dimensions.width;
const styles = StyleSheet.create({
  outerContainer: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    zIndex: 100,
    position: "absolute",
    alignSelf: "center"
  }
});

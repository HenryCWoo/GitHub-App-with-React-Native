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

  updateUserInfo() {
    this.getGithubUser();
    this.getRequestChangeState(
      `/users/${this.state.user}/repos`,
      "githubRepos"
    );
    this.getRequestChangeState(
      `/users/${this.state.user}/followers`,
      "githubFollowers"
    );
    this.getRequestChangeState(
      `/users/${this.state.user}/following`,
      "githubFollowing"
    );
  }

  componentDidMount() {
    this.updateUserInfo();
  }

  componentDidUpdate() {
    if (this.state.user !== this.state.prevUser) {
      this.updateUserInfo();
    }
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
  getRequestChangeState(endpoint, stateKey) {
    fetch(`https://api.github.com` + endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson =>
        this.setState({
          [stateKey]: responseJson
        })
      );
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
      if (this.state.githubRepos) {
        return (
          <View>
            <Tabs
              renderTabBar={() => (
                <ScrollableTab
                  style={{ backgroundColor: "transparent", height: 80 }}
                />
              )}>
              {[
                // First Item is used to index the count
                // Second is tab header
                // Third is the component
                [
                  "public_repos",
                  "PUBLIC REPOS",
                  <PublicRepoList
                    githubRepos={this.state.githubRepos}
                    user={this.state.user}
                  />
                ],
                [
                  "followers",
                  "FOLLOWERS",
                  <UsersList
                    githubUsers={this.state.githubFollowers}
                    changeUserHandler={this.changeUserHandler.bind(this)}
                  />
                ],
                [
                  "following",
                  "FOLLOWING",
                  <UsersList
                    githubUsers={this.state.githubFollowing}
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

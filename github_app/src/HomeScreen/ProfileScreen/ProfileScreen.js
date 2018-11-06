import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
  StyleSheet
} from "react-native";
import {
  Tab,
  Tabs,
  TabHeading,
  Icon,
  ScrollableTab,
  Button
} from "native-base";
import PublicRepoList from "./Lists/PublicRepoList";
import UsersList from "./Lists/UsersList";
import UpperScreen from "./UpperScreen";
import { _storeData, storageKeys } from "../../utils/AsyncStorageOps";
import NotificationsList, {
  countUnreadNotifications
} from "./Lists/NotificationsList";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: this.props.navigation.state.params.user,
      accessToken: this.props.navigation.state.params.accessToken,
      basicCredentials: this.props.navigation.state.params.basicCredentials,
      user: this.props.navigation.state.params.user, //Current user to display
      prevUser: null, //Detects change in user and prevents infinite rerenders
      githubUser: null, //Holds JSON object of user info
      unreadNotifs: 0 //Count of unread notifications
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

  getNotifications() {
    if (this.state.loggedInUser === this.state.user) {
      let headers = new Headers();
      headers.append("all", "true");
      if (this.state.basicCredentials) {
        headers.append("Authorization", "Basic " + this.state.basicCredentials);
      } else if (this.state.accessToken) {
        headers.append("Authorization", "Bearer " + this.state.accessToken);
      }
      fetch(`https://api.github.com/notifications`, {
        method: "GET",
        headers: headers
      })
        .then(response => response.json())
        .then(responseJson =>
          this.setState({
            notifications: responseJson,
            unreadNotifs: countUnreadNotifications(responseJson)
          })
        );
    }
  }

  componentWillMount() {
    this.getGithubUser();
    this.getNotifications();
  }

  componentDidUpdate() {
    if (this.state.user !== this.state.prevUser) {
      // This check prevents infinite rendering
      this.getGithubUser();
    }
  }

  changeUserHandler(newUser) {
    this.setState({ user: newUser });
  }

  renderBackDrop() {
    if (this.state.user && this.state.githubUser) {
      return (
        <View>
          <ImageBackground
            style={styles.profileBackground}
            source={{ uri: this.state.githubUser.avatar_url }}
            blurRadius={10}>
            <View style={styles.dimBackground} />
          </ImageBackground>
        </View>
      );
    }
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
                  changeUserHandler={this.changeUserHandler}
                />
              ],
              "notifications"
            ].map((itemSet, index) => {
              if (
                this.state.user === this.state.loggedInUser &&
                itemSet === "notifications"
              ) {
                return (
                  <Tab
                    key={"tabheader" + index}
                    heading={
                      <TabHeading
                        style={{ backgroundColor: "transparent", flex: 1 }}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center"
                          }}>
                          <Text style={{ color: "white" }}>
                            {this.state.unreadNotifs}
                          </Text>
                          <Text style={{ color: "grey", fontSize: 12 }}>
                            UNREAD
                          </Text>
                          <Text style={{ color: "grey", fontSize: 12 }}>
                            NOTIFICATIONS
                          </Text>
                        </View>
                      </TabHeading>
                    }>
                    <NotificationsList
                      notifications={this.state.notifications}
                    />
                  </Tab>
                );
              } else if (itemSet !== "notifications") {
                return (
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
                );
              }
            })}
          </Tabs>
        </View>
      );
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={{ color: "white", fontSize: 14 }}>Profile</Text>
      ),
      headerLeft: (
        <Button
          transparent
          onPress={() => {
            Alert.alert(
              "Logout?",
              "",
              [
                {
                  text: "Cancel"
                },
                {
                  text: "Confirm",
                  onPress: () => {
                    _storeData(storageKeys.AUTH_CODE_KEY, "");
                    navigation.navigate("LoginScreen");
                  }
                }
              ],
              { cancelable: false }
            );
          }}>
          <Icon type="Feather" name="log-out" style={{ color: "white" }} />
        </Button>
      ),
      headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 }
    };
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderBackDrop()}
        <ScrollView bounces={false}>
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
const backgroundImageHeight = Math.round(dimensions.width * 2.2);
const backgroundImageWidth = dimensions.width;
const styles = StyleSheet.create({
  profileBackground: {
    width: backgroundImageWidth,
    height: backgroundImageHeight,
    transform: [{ translateY: -backgroundImageHeight * 0.3 }],
    zIndex: -1,
    position: "absolute"
  },
  dimBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .6)",
    zIndex: 10
  }
});

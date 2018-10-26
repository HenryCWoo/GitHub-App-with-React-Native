import React, { Component } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  Text
} from "react-native";
import { Header, Avatar, Icon } from "react-native-elements";
import { Tab, Tabs, TabHeading, ScrollableTab } from "native-base";
import { StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import PublicRepoList from "./PublicRepoList";
import FollowersList from "./FollowersList";
import Moment from "moment";

const MyText = props => {
  return (
    <Text styles={{ fontFamily: "Roboto" }} {...props}>
      {props.children}
    </Text>
  );
};

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
    let curUser = this.state.user;
    this.setState({ user: newUser });
  }

  renderAvatar() {
    if (this.state.githubUser) {
      var avatar_size = Math.round(dimensions.width / 2);
      return (
        <View
          style={{
            marginTop: Math.round(dimensions.height * 0.15)
          }}>
          <Avatar
            xlarge
            rounded
            source={{ uri: this.state.githubUser.avatar_url }}
          />
        </View>
      );
    }
    // Place holder in case of failed API call
    return (
      <Icon
        type="entypo"
        name="github-with-circle"
        size={avatar_size}
        color="darkgrey"
      />
    );
  }

  renderProfileName() {
    if (this.state.githubUser) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column"
          }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 10 }}>
            <MyText
              style={{
                textAlign: "center",
                fontSize: 36,
                marginTop: 24,
                marginBottom: 2,
                color: "white"
              }}>
              {this.state.githubUser.name}
            </MyText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center"
              }}>
              <Icon size={16} type="feather" name="feather" color="lightgrey" />
              <MyText
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "lightgrey",
                  marginLeft: 2
                }}>
                {this.state.githubUser.login}
              </MyText>
            </View>
          </View>
        </View>
      );
    }
    return <MyText>New fone who dis?</MyText>;
  }

  renderGenericBadge(field, iconType, iconName) {
    if (this.state.githubUser) {
      if (this.state.githubUser[field] != null)
        return (
          <View
            style={{
              margin: 8,
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center"
            }}>
            {iconType != null && iconName != null ? (
              <Icon type={iconType} name={iconName} color="white" size={16} />
            ) : (
              {}
            )}
            <MyText
              style={{
                borderRadius: 5
              }}>
              <MyText
                style={{ fontSize: 14, textAlign: "center", color: "white" }}>
                {this.state.githubUser[field]}
              </MyText>
            </MyText>
          </View>
        );
    }
  }

  renderJoinDate(iconType, iconName) {
    if (this.state.githubUser) {
      return (
        <View
          style={{
            margin: 8,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center"
          }}>
          {iconType != null && iconName != null ? (
            <Icon type={iconType} name={iconName} color="white" size={16} />
          ) : (
            {}
          )}
          <MyText
            style={{
              borderRadius: 5
            }}>
            <MyText
              style={{ fontSize: 14, textAlign: "center", color: "white" }}>
              {Moment(this.state.githubUser["created_at"]).format(
                "MMM d, YYYY"
              )}
            </MyText>
          </MyText>
        </View>
      );
    }
  }

  renderBackDrop() {
    if (this.state.githubUser) {
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
    return (
      <Header
        backgroundColor="transparent"
        outerContainerStyles={{
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0
        }}
        centerComponent={{
          text: "Profile",
          style: { color: "black" }
        }}
      />
    );
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
                <FollowersList
                  user={this.state.user}
                  getUserType="followers"
                  changeUserHandler={this.changeUserHandler}
                />
              ],
              [
                "following",
                "FOLLOWING",
                <FollowersList
                  user={this.state.user}
                  getUserType="following"
                  changeUserHandler={this.changeUserHandler}
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
          {this.renderBackDrop()}
          <View style={styles.mainContainer}>
            <View style={{ alignItems: "center" }}>
              {this.renderAvatar()}
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Swiper
                  loop={false}
                  activeDot={<View style={styles.activeDot} />}
                  style={{
                    height: dimensions.height * 0.3
                  }}>
                  {this.renderProfileName(16, 24)}
                  <View>
                    {this.renderGenericBadge("bio", "feather", "gift")}
                    {this.renderJoinDate("feather", "sunset")}
                    {this.renderGenericBadge(
                      "html_url",
                      "feather",
                      "file-minus"
                    )}
                    {this.renderGenericBadge("email", "feather", "help-circle")}
                  </View>
                </Swiper>
              </View>
            </View>
          </View>
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
  mainContainer: {
    justifyContent: "center"
  },
  outerContainer: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    zIndex: 100,
    position: "absolute",
    alignSelf: "center"
  },
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
  },
  activeDot: {
    backgroundColor: "white",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  }
});

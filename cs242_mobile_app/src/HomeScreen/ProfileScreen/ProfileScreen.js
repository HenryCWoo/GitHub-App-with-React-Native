import React, { Component } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity,
  Text
} from "react-native";
import { Header, Avatar, Badge, Icon, Tile, Card } from "react-native-elements";
import {
  Container,
  Header as NativeBaseHeader,
  Content,
  Tab,
  Tabs,
  View as NativeBaseView,
  TabHeading,
  ScrollableTab
} from "native-base";
import { StyleSheet } from "react-native";

const MyText = props => {
  return (
    <Text styles={{ fontFamily: "Iowan Old Style" }} {...props}>
      {props.children}
    </Text>
  );
};

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "HenryCWoo",
      githubUser: null
    };
  }

  getGithubUser() {
    return fetch(`https://api.github.com/users/${this.state.user}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => this.setState({ githubUser: responseJson }));
  }

  componentDidMount() {
    this.getGithubUser();
  }

  componentDidUpdate() {
    console.log(this.state.githubUser);
  }

  renderAvatar() {
    if (this.state.githubUser) {
      var avatar_size = Math.round(dimensions.width / 2);
      console.log(avatar_size);
      return (
        <View
          style={{
            marginTop: Math.round(dimensions.height * 0.1)
          }}>
          <Avatar
            xlarge
            rounded
            source={{ uri: this.state.githubUser.avatar_url }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
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

  renderProfileName(topMargin, bottomMargin) {
    if (this.state.githubUser) {
      return (
        <View>
          <MyText
            style={{
              textAlign: "center",
              fontSize: 24,
              marginTop: topMargin,
              marginBottom: 2,
              color: "white"
            }}>
            {this.state.githubUser.name}
          </MyText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              marginBottom: bottomMargin
            }}>
            <Icon size={16} type="entypo" name="github" color="white" />
            <MyText
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "white",
                marginLeft: 2
              }}>
              {this.state.githubUser.login}
            </MyText>
          </View>
        </View>
      );
    }
    return <MyText>New fone who dis?</MyText>;
  }

  renderGenericBadge(field) {
    if (this.state.githubUser) {
      if (this.state.githubUser[field] != null)
        return (
          <Card
            containerStyle={{
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, .2)",
              padding: 2,
              borderColor: "transparent"
            }}>
            <MyText style={{ textAlign: "center", color: "white" }}>
              {this.state.githubUser[field]}
            </MyText>
          </Card>
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
    return (
      <View>
        <Tabs
          transparent
          renderTabBar={() => (
            <ScrollableTab style={{ backgroundColor: "transparent" }} />
          )}>
          <Tab
            heading={
              <TabHeading style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "white" }}>PUBLIC REPOS</Text>
              </TabHeading>
            }>
            <Text>INSERT THINGS HERE DOOD</Text>
          </Tab>
          <Tab
            heading={
              <TabHeading style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "white" }}>FOLLOWERS</Text>
              </TabHeading>
            }
          />
          <Tab
            heading={
              <TabHeading style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "white" }}>FOLLOWING</Text>
              </TabHeading>
            }
          />
        </Tabs>
        <Container />
      </View>
    );
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
              {this.renderProfileName(16, 24)}
              {this.renderGenericBadge("bio")}
              {this.renderGenericBadge("html_url")}
              {this.renderGenericBadge("email")}
            </View>
          </View>
          {this.renderTabs()}
        </ScrollView>
      </View>
    );
  }
}

const dimensions = Dimensions.get("window");
const backgroundImageHeight = Math.round(dimensions.width * 2);
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
  }
});

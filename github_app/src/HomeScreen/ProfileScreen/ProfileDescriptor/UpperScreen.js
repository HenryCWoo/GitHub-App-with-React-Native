import React, { Component } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  StyleSheet,
  ImageBackground
} from "react-native";
import { Header, Avatar } from "react-native-elements";
import { Icon } from "native-base";
import Swiper from "react-native-swiper";
import Moment from "moment";

class UpperScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderAvatar() {
    if (this.props.githubUser) {
      var avatar_size = Math.round(dimensions.width / 2);
      return (
        <View
          style={{
            marginTop: Math.round(dimensions.height * 0.15)
          }}>
          <Avatar
            xlarge
            rounded
            source={{ uri: this.props.githubUser.avatar_url }}
          />
        </View>
      );
    }
    // Place holder in case of failed API call
    return (
      <Icon
        type="Entypo"
        name="github-with-circle"
        size={avatar_size}
        color="darkgrey"
      />
    );
  }

  renderProfileName() {
    if (this.props.githubUser) {
      return (
        <View
          style={{
            flexDirection: "column"
          }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 36,
              marginTop: 24,
              marginBottom: 2,
              color: "white"
            }}>
            {this.props.githubUser.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center"
            }}>
            <Icon
              type="Feather"
              name="github"
              style={{ color: "lightgrey", fontSize: 16 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "lightgrey",
                marginLeft: 2
              }}>
              {this.props.githubUser.login}
            </Text>
          </View>
        </View>
      );
    }
    return <Text>New fone who dis?</Text>;
  }

  renderGenericBadge(field, iconType, iconName) {
    if (this.props.githubUser) {
      if (this.props.githubUser[field] != null)
        return (
          <View
            style={{
              margin: 8,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
            {iconType != null && iconName != null ? (
              <Icon
                type={iconType}
                name={iconName}
                style={{ color: "white", fontSize: 16 }}
              />
            ) : (
              {}
            )}
            <Text
              style={{
                borderRadius: 5
              }}>
              <Text
                style={{ fontSize: 14, textAlign: "center", color: "white" }}>
                {this.props.githubUser[field]}
              </Text>
            </Text>
          </View>
        );
    }
  }

  renderJoinDate(iconType, iconName) {
    if (this.props.githubUser) {
      return (
        <View
          style={{
            margin: 8,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
          {iconType != null && iconName != null ? (
            <Icon
              type={iconType}
              name={iconName}
              style={{ color: "white", fontSize: 16 }}
            />
          ) : (
            {}
          )}
          <Text style={{ borderRadius: 5 }}>
            <Text style={{ fontSize: 14, textAlign: "center", color: "white" }}>
              {Moment(this.props.githubUser["created_at"]).format(
                "MMM d, YYYY"
              )}
            </Text>
          </Text>
        </View>
      );
    }
  }

  renderBackDrop() {
    if (this.props.githubUser) {
      return (
        <View>
          <ImageBackground
            style={styles.profileBackground}
            source={{ uri: this.props.githubUser.avatar_url }}
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

  render() {
    return (
      <View>
        {this.renderBackDrop()}
        <View style={styles.mainContainer}>
          {this.renderAvatar()}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Swiper
              loop={false}
              activeDot={<View style={styles.activeDot} />}
              style={{
                height: dimensions.height * 0.35
              }}>
              {this.renderProfileName(16, 24)}
              <View>
                {this.renderGenericBadge("bio", "Feather", "info")}
                {this.renderGenericBadge("html_url", "Feather", "globe")}
                {this.renderGenericBadge("email", "Feather", "at-sign")}
                {this.renderJoinDate("FontAwesome", "github")}
                <View style={{ margin: 36 }} />
              </View>
            </Swiper>
          </View>
        </View>
      </View>
    );
  }
}

const dimensions = Dimensions.get("window");
const backgroundImageHeight = Math.round(dimensions.width * 2.5);
const backgroundImageWidth = dimensions.width;
const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  profileBackground: {
    width: backgroundImageWidth,
    height: backgroundImageHeight,
    transform: [{ translateY: -backgroundImageHeight * 0.2 }],
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

export default UpperScreen;

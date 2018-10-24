import React, { Component } from "react";
import { View } from "react-native";
import { Header, Avatar, Badge, Text, Icon } from "react-native-elements";
import { StyleSheet } from "react-native";

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
      return (
        <Avatar
          xlarge
          rounded
          source={{ uri: this.state.githubUser.avatar_url }}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        />
      );
    }
    // Place holder in case of failed API call
    return (
      <Icon
        type="entypo"
        name="github-with-circle"
        size={150}
        color="darkgrey"
      />
    );
  }

  renderProfileName() {
    if (this.state.githubUser) {
      return (
        <View>
          <Text h3>{this.state.githubUser.name}</Text>
          <Text h4>{this.state.githubUser.login}</Text>
        </View>
      );
    }
    return <Text h3>New fone who dis?</Text>;
  }

  renderGenericText(field) {
    if (this.state.githubUser) {
      return (
        <View>
          <Text style={{ textAlign: "center" }}>
            {this.state.githubUser[field]}
          </Text>
        </View>
      );
    }
    return <Text>GENERIC TEXT</Text>;
  }

  render() {
    return (
      <View>
        <Header
          style={{}}
          centerComponent={{
            text: "My Github Profile",
            style: { color: "#fff" }
          }}
        />
        <View style={styles.main_container}>
          <View>
            {this.renderAvatar()}
            {this.renderProfileName()}
            {this.renderGenericText("bio")}
            {this.renderGenericText("html_url")}
            {this.renderGenericText("email")}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    justifyContent: "center"
  }
});

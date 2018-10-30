import React, { Component } from "react";
import { List, ListItem, Text, View, Icon } from "native-base";
import { Avatar } from "react-native-elements";

export default class UsersList extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      githubUsers: null,
      githubUsersWithName: null
    };
  }

  getGithubFollowers() {
    fetch(
      `https://api.github.com/users/${this.props.user}/${
        this.props.getUserType
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => this.setState({ githubUsers: responseJson }));
  }

  componentDidMount() {
    this.getGithubFollowers();
  }

  componentDidUpdate() {
    this.getGithubFollowers();
  }

  populateListItem(user) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ marginRight: 8 }}>
          <Avatar medium rounded source={{ uri: user.avatar_url }} />
        </View>
        <View style={{ flex: 2 }}>
          <Text>{user["login"]}</Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        />
      </View>
    );
  }

  createList() {
    return this.state.githubUsers.map(user => (
      <ListItem
        style={{ height: 80 }}
        key={user["node_id"]}
        onPress={() => {
          this.props.changeUserHandler(user["login"]);
        }}>
        {this.populateListItem(user)}
      </ListItem>
    ));
  }

  render() {
    if (this.state.githubUsers) {
      return <List key="UsersList">{this.createList()}</List>;
    }
    return (
      <View
        style={{ justifyContent: "center", alignContent: "center", margin: 8 }}>
        <Icon size={140} type="font-awesome" name="github" color="grey" />
      </View>
    );
  }
}

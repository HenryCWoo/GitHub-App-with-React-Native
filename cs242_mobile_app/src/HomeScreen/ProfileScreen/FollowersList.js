import React, { Component } from "react";
import { List, ListItem, Text, View } from "native-base";

export default class FollowersList extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      githubFollowers: null
    };
  }

  getGithubFollowers() {
    fetch(`https://api.github.com/users/${this.props.user}/followers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => this.setState({ githubFollowers: responseJson }));
  }

  componentDidMount() {
    this.getGithubFollowers();
  }

  populateListItem(user) {
    return (
      <View style={{ flexDirection: "row" }}>
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
    return this.state.githubFollowers.map(user => (
      <ListItem style={{ height: 80 }} key={user["node_id"]}>
        {this.populateListItem(user)}
        {console.log(user)}
      </ListItem>
    ));
  }

  render() {
    if (this.state.githubFollowers) {
      return <List key="FollowersList">{this.createList()}</List>;
    }
    return <Text>No followers.</Text>;
  }
}

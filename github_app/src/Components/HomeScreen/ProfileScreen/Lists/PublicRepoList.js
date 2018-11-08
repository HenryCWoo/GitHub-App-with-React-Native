import React, { Component } from "react";
import { Linking } from "react-native";
import { List, ListItem, Text, View, Icon, Badge } from "native-base";
import { Avatar } from "react-native-elements";

export default class PublicRepoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      githubRepos: null,
      prevUser: null
    };
  }

  getGithubRepos() {
    fetch(`https://api.github.com/users/${this.props.user}/repos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson =>
        this.setState({
          githubRepos: responseJson,
          prevUser: this.props.user
        })
      );
  }

  componentDidMount() {
    this.getGithubRepos();
  }

  componentDidUpdate() {
    if (this.state.prevUser !== this.props.user) {
      this.getGithubRepos();
    }
  }

  drawLanguageBadge(repo) {
    if (repo["language"]) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Badge style={{ backgroundColor: "grey" }}>
            <Text style={{ fontSize: 12, color: "white" }}>
              {repo["language"]}
            </Text>
          </Badge>
        </View>
      );
    }
  }

  drawMITLicense(repo) {
    if (repo["license"]) {
      if (repo["license"]["name"] == "MIT License") {
        return (
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <Icon
              style={{
                fontSize: 14,
                color: "grey",
                marginRight: 4
              }}
              type="FontAwesome"
              name="balance-scale"
            />
            <Text style={{ fontSize: 12, color: "grey" }}>MIT License</Text>
          </View>
        );
      }
    }
  }

  populateListItem(repo) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <Text>{repo["name"]}</Text>
          <Text style={{ fontSize: 12, color: "grey" }}>
            {repo["owner"]["login"]}
          </Text>
          <Text style={{ fontSize: 12, color: "grey" }}>
            {repo["description"]}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-end"
          }}>
          {this.drawLanguageBadge(repo)}
          {this.drawMITLicense(repo)}
        </View>
      </View>
    );
  }

  createList() {
    if (this.state.githubRepos) {
      const repoArray = this.state.githubRepos;
      return repoArray.map(repo => (
        <ListItem
          style={{ alignSelf: "baseline" }}
          key={repo["id"]}
          onPress={() => this.props.navigateToRepoScreen(repo)}>
          {this.populateListItem(repo)}
        </ListItem>
      ));
    }
  }

  render() {
    if (this.state.githubRepos) {
      if (this.state.githubRepos.length > 0) {
        return <List key="PublicReposList">{this.createList()}</List>;
      }
    }
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          margin: 8,
          paddingTop: 100,
          paddingBottom: 100,
          flex: 1,
          flexDirection: "column"
        }}>
        <Icon
          type="FontAwesome"
          name="github"
          style={{ fontSize: 50, color: "grey" }}
        />
      </View>
    );
  }
}

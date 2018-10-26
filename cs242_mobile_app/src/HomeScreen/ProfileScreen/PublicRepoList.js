import React, { Component } from "react";
import { Linking } from "react-native";
import { List, ListItem, Text, View } from "native-base";
import { Icon } from "react-native-elements";

export default class PublicRepoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      githubRepos: null
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
      .then(responseJson => this.setState({ githubRepos: responseJson }));
  }

  componentDidMount() {
    this.getGithubRepos();
  }

  getLanguageIcon(repoLanguage) {
    let createIcon = iconNameColorPair => (
      <Icon
        type="material-community-icons"
        name={iconNameColorPair[0]}
        color={iconNameColorPair[1]}
      />
    );
    var colorDict = { Python: ["python", "green"] };
    let nameValuePair = colorDict[repoLanguage];
    if (nameValuePair) {
      return createIcon(colorDict[repoLanguage]);
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
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        />
      </View>
    );
  }

  createList() {
    return this.state.githubRepos.map((repo, index) => (
      <ListItem
        style={{ height: 80 }}
        key={repo["id"]}
        onPress={() => {
          Linking.openURL(repo["html_url"]).catch(err =>
            console.error("An error occurred", err)
          );
        }}>
        {this.populateListItem(repo)}
        {console.log(repo)}
      </ListItem>
    ));
  }

  render() {
    if (this.state.githubRepos) {
      return <List key="PublicReposList">{this.createList()}</List>;
    }
    return <Text>No public repos.</Text>;
  }
}

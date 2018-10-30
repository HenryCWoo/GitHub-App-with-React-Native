import React, { Component } from "react";
import { Linking } from "react-native";
import { List, ListItem, Text, View, Icon } from "native-base";

export default class PublicRepoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      githubRepos: null
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

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
    if (this.props.githubRepos) {
      const repoArray = this.props.githubRepos;
      return repoArray.map(repo => (
        <ListItem
          style={{ height: 80 }}
          key={repo["id"]}
          onPress={() => {
            Linking.canOpenURL(repo["html_url"])
              .then(supported => {
                if (!supported) {
                  console.log("Can't handle url: " + repo["html_url"]);
                } else {
                  return Linking.openURL(repo["html_url"]);
                }
              })
              .catch(err => console.error("An error occurred", err));
          }}>
          {this.populateListItem(repo)}
        </ListItem>
      ));
    }
  }

  render() {
    if (this.props.githubRepos) {
      return <List key="PublicReposList">{this.createList()}</List>;
    }
    return (
      <View
        style={{ justifyContent: "center", alignContent: "center", margin: 8 }}>
        <Icon size={140} type="font-awesome" name="github" color="grey" />
      </View>
    );
  }
}

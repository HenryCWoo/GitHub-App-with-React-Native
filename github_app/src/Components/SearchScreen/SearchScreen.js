import React, { Component } from "react";
import { StatusBar, Linking } from "react-native";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Separator,
  View,
  Button,
  Icon
} from "native-base";
import { SearchBar, Avatar } from "react-native-elements";

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: null
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
  }

  handleTextChange(value) {
    this.setState({ searchText: value });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleTextChange: this.handleTextChange,
      getSearchResults: this.getSearchResults
    });
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  getSearchResults() {
    fetch(`https://api.github.com/search/users?q=${this.state.searchText}`, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        this.setState({
          userResults: responseJson
        });
      });

    fetch(
      `https://api.github.com/search/repositories?q=${this.state.searchText}`,
      {
        method: "GET"
      }
    )
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        this.setState({
          repoResults: responseJson
        });
      });
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: (
        <View style={{ flexDirection: "row", flex: 1 }}>
          <SearchBar
            lightTheme
            clearIcon
            searchIcon={{ size: 24 }}
            onChangeText={value => params.handleTextChange(value)}
            onClear={() => params.handleTextChange("")}
            placeholder="Search"
            containerStyle={{
              backgroundColor: "transparent",
              flex: 1,
              borderTopWidth: 0
            }}
          />
        </View>
      ),
      headerRight: (
        <Button transparent onPress={() => params.getSearchResults()}>
          <Text style={{ color: "blue" }}>Search</Text>
        </Button>
      )
    };
  };

  createUserListItems() {
    if (this.state.userResults) {
      return this.state.userResults.items.map(curUser => {
        return (
          <ListItem
            onPress={() => {
              this.props.navigation.state.params.changeUserHandler(
                curUser["login"]
              );
              this.props.navigation.navigate("ProfileScreen");
            }}
            key={curUser["id"]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Avatar
                size="small"
                rounded
                source={{ uri: curUser["avatar_url"] }}
              />
              <Text style={{ marginLeft: 10, color: "grey" }}>
                {curUser["login"]}
              </Text>
            </View>
          </ListItem>
        );
      });
    }
  }

  createRepoListItems() {
    if (this.state.repoResults) {
      return this.state.repoResults.items.map(curRepo => {
        return (
          <ListItem
            onPress={() => {
              this.props.navigation.state.params.navigateToRepoScreen(curRepo);
            }}
            key={curRepo["id"]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Text>{curRepo["name"]}</Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar
                  size="small"
                  rounded
                  source={{ uri: curRepo["owner"]["avatar_url"] }}
                />
                <Text style={{ marginLeft: 4, fontSize: 12 }}>
                  {curRepo["owner"]["login"]}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1
                }}>
                {this.createIcon(
                  "Feather",
                  "star",
                  curRepo["stargazers_count"]
                )}
                {this.createIcon("Feather", "eye", curRepo["watchers_count"])}
                {this.createIcon(
                  "FontAwesome",
                  "code-fork",
                  curRepo["forks_count"]
                )}
                {this.createIcon("Entypo", "code", curRepo["language"])}
              </View>
            </View>
          </ListItem>
        );
      });
    }
  }

  createIcon(type, name, value) {
    if (value) {
      return (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            margin: 4
          }}>
          <Icon name={name} type={type} style={{ fontSize: 16 }} />
          <Text style={{ color: "grey", fontSize: 10 }}>{value}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Separator bordered>
            <Text>USERS</Text>
          </Separator>
          {this.createUserListItems()}
          <Separator bordered>
            <Text>REPOS</Text>
          </Separator>
          {this.createRepoListItems()}
        </Content>
      </Container>
    );
  }
}

export default SearchScreen;

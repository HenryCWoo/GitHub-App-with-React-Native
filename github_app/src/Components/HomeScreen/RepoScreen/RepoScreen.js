import React, { Component } from "react";
import { Linking } from "react-native";
import { View, Text, Icon, Button, Card, CardItem } from "native-base";
import { LineChart, YAxis } from "react-native-svg-charts";
import Moment from "moment";

export default class RepoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commitData: {}
    };
  }

  async getWeeklyCommits() {
    let repoFullName = this.props.navigation.state.params.repo["full_name"];
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/stats/participation`,
      {
        method: "GET"
      }
    );
    const data = await response.json();
    this.setState({ commitData: data });
  }

  componentWillMount() {
    this.getWeeklyCommits();
  }

  componentDidMount() {
    console.log(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: (
        <Text style={{ color: "#007dff", fontSize: 14 }}>
          {params.repo["full_name"]}
        </Text>
      ),
      headerRight: (
        <Button
          transparent
          onPress={() => {
            let url = params.repo["html_url"];
            Linking.canOpenURL(url)
              .then(supported => {
                if (!supported) {
                  console.log("Can't handle url: " + url);
                } else {
                  return Linking.openURL(url);
                }
              })
              .catch(err => console.error("An error occurred", err));
          }}>
          <Icon
            type="Feather"
            name="external-link"
            style={{ color: "#007dff" }}
          />
        </Button>
      )
    };
  };

  createIcon(type, name, value) {
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

  renderIconsBar(curRepo) {
    return (
      <View
        style={{
          flexDirection: "row"
        }}>
        {this.createIcon("Feather", "star", curRepo["stargazers_count"])}
        {this.createIcon("Feather", "eye", curRepo["watchers_count"])}
        {this.createIcon("FontAwesome", "code-fork", curRepo["forks_count"])}
        {this.createIcon("Entypo", "code", curRepo["language"])}
      </View>
    );
  }

  renderHeaderCard() {
    let repo = this.props.navigation.state.params.repo;
    return (
      <View style={{ padding: 8 }}>
        <Card>
          <CardItem>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 32 }}>{repo["name"]}</Text>
              <Text style={{ fontSize: 16, color: "grey", marginBottom: 16 }}>
                {repo["description"]}
              </Text>
              <Text style={{ fontSize: 12, color: "grey" }}>
                Last updated: {Moment(repo["updated_at"]).format("LLLL")}
              </Text>
              <View>
                <Text style={{ fontSize: 12, color: "grey" }}>
                  Owner: {repo["owner"]["login"]}
                </Text>
              </View>
              {this.renderIconsBar(repo)}
            </View>
          </CardItem>
        </Card>
      </View>
    );
  }

  render() {
    var data = [];
    if (this.state.commitData["all"]) {
      data = this.state.commitData["all"];
    }

    const contentInset = { top: 20, bottom: 20 };

    return (
      <View>
        {this.renderHeaderCard()}
        <View style={{ padding: 8 }}>
          <Card>
            <Text style={{ marginTop: 16, marginLeft: 16, fontSize: 12 }}>
              Weekly Commits in a Year
            </Text>
            <View
              style={{
                height: 200,
                flexDirection: "row",
                marginLeft: 16,
                marginRight: 16
              }}>
              <YAxis
                data={data}
                contentInset={contentInset}
                svg={{
                  fill: "grey",
                  fontSize: 10
                }}
                numberOfTicks={10}
              />
              <LineChart
                style={{ flex: 1, marginLeft: 16 }}
                data={data}
                svg={{ stroke: "#5194ff", strokeWidth: 3 }}
                contentInset={contentInset}
              />
            </View>
          </Card>
        </View>
      </View>
    );
  }
}

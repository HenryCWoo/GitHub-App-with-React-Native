import React, { Component } from "react";
import { Linking } from "react-native";
import { List, ListItem, Text, View, Icon, Badge } from "native-base";
import { Avatar } from "react-native-elements";

class NotificationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications
    };
  }

  componentWillReceiveProps() {
    this.setState({ notifications: this.props.notifications });
  }

  componentDidUpdate() {}

  notificationSeenIcon(unread) {
    if (unread) {
      return <Icon type="FontAwesome" name="eye" />;
    }
  }

  //TODO: format listing for notifications, implement clickability, allow filtering by read/unread

  //Take user to GitHub to view issue
  redirectToGithub(url) {
    let headers = new Headers();
    headers.append("all", "true");
    if (this.props.basicCredentials) {
      headers.append("Authorization", "Basic " + this.props.basicCredentials);
    } else if (this.props.accessToken) {
      headers.append("Authorization", "Bearer " + this.props.accessToken);
    }
    fetch(url, {
      method: "GET",
      headers: headers
    })
      .then(response => response.json())
      .then(responseJson => {
        let url = responseJson["html_url"];
        Linking.canOpenURL(url)
          .then(supported => {
            if (!supported) {
              console.log("Can't handle url: " + url);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch(err => console.error("An error occurred", err));
      });
  }

  markRead(url) {
    let headers = new Headers();
    if (this.props.basicCredentials) {
      headers.append("Authorization", "Basic " + this.props.basicCredentials);
    } else if (this.props.accessToken) {
      headers.append("Authorization", "Bearer " + this.props.accessToken);
    }
    fetch(url, {
      method: "PATCH",
      headers: headers
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      });
  }

  createList() {
    if (this.state.notifications) {
      const notifArray = this.state.notifications;
      return notifArray.map(notif => (
        <ListItem
          style={{
            flex: 1,
            backgroundColor: notif["unread"] ? "#eaf2ff" : "white",
            marginLeft: 0
          }}
          key={notif["id"]}
          onPress={() => {
            this.redirectToGithub(notif["subject"]["url"]);
            this.markRead(notif["url"]);
          }}>
          {this.populateListItem(notif)}
        </ListItem>
      ));
    }
  }

  populateListItem(notif) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: 16,
          minHeight: 50
        }}>
        <Avatar
          source={{ uri: notif["repository"]["owner"]["avatar_url"] }}
          size="medium"
          rounded
          containerStyle={{ marginRight: 8, backgroundColor: "white" }}
        />
        <View style={{ flex: 2 }}>
          <Text>{notif["repository"]["name"]}</Text>
          <Text style={{ fontSize: 12, color: "grey" }}>
            {notif["subject"]["title"]}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end"
          }}>
          <Badge style={{ backgroundColor: "grey" }}>
            <Text style={{ fontSize: 12, color: "white" }}>
              {notif["reason"]}
            </Text>
          </Badge>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.notifications) {
      if (this.state.notifications.length > 0) {
        return <List key="NotificationsList">{this.createList()}</List>;
      }
    }
    return (
      //Placeholder image
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          margin: 8,
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

export function countUnreadNotifications(notifJsonArray) {
  let count = 0;
  if (notifJsonArray) {
    for (var index = 0; index < notifJsonArray.length; index++) {
      if (notifJsonArray[index]["unread"] == true) {
        count += 1;
      }
    }
  }
  return count;
}

export default NotificationsList;

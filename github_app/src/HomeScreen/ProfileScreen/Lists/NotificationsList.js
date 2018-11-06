import React, { Component } from "react";
import { View } from "react-native";

class NotificationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications
    };
  }

  componentDidMount() {
    console.log(this.state.notifications);
  }

  componentDidUpdate() {}

  render() {
    if (this.state.notifications) {
      return <List key="NotificationsList">{this.createList()}</List>;
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

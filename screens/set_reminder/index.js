import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View } from 'react-native';
import { RadioButton, List, FAB, IconButton, Divider, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationSetup from '../../utilities/push-notifications';

import {REPORT_NAVIGATION_REF} from '../../routes/AppDrawer';

export default class SetReminder extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      time: "30_MINUTES",
    };
  }

  _setTime = (time) => this.setState({time});

  _setReminder = () => {
    NotificationSetup.postScheduledNotification(
      {
        body: "This is a reminder to add details about the matatu you were in when the incident ocurred",
        title: "Add Matatu details",
        silent: false
      },
      this.state.time
    );

    REPORT_NAVIGATION_REF.navigate("Home");
  }

  render() {

    return (
      <ScrollView style={styles.screen}>
        {/* <Icon name="clock" /> */}
        <Caption style={styles.caption}>{"We noticed that you filled in that the incident happened inside the bus. Would you like to set a reminder to help fill in the number plate details once you alight?"}</Caption>
        <List.Section 
          title="Set alarm for:"
        />
        <RadioButton.Group value={this.state.time} onValueChange={this._setTime}>
          <List.Item 
            style={styles.timer}
            left={props => <RadioButton value="5_MINUTES" />}
            title="5 minutes"
            description="Set a reminder for 5 minutes from now"
            onPress={this._setTime.bind(this, "5_MINUTES")}
          />
          <Divider />
          <List.Item 
            style={styles.timer}
            left={props => <RadioButton value="15_MINUTES" />}
            title="15 minutes"
            description="Set a reminder for 15 minutes from now"
            onPress={this._setTime.bind(this, "15_MINUTES")}
          />
          <Divider />
          <List.Item 
            style={styles.timer}
            left={props => <RadioButton value="30_MINUTES" />}
            title="30 minutes"
            description="Set a reminder for 30 minutes from now"
            onPress={this._setTime.bind(this, "30_MINUTES")}
          />
          <Divider />
          <List.Item 
            style={styles.timer}
            left={props => <RadioButton value="45_MINUTES" />}
            title="45 minutes"
            description="Set a reminder for 45 minutes from now"
            onPress={this._setTime.bind(this, "45_MINUTES")}
          />
          <Divider />
          <List.Item 
            style={styles.timer}
            left={props => <RadioButton value="60_MINUTES" />}
            title="60 minutes"
            description="Set a reminder for an hour from now"
            onPress={this._setTime.bind(this, "60_MINUTES")}
          />
        </RadioButton.Group>
        <IconButton 
          icon="clock" 
          size={50} 
          onPress={this._setReminder} 
          style={styles.iconButton}
        />

        <List.Section 
          title="Fill in details now"
        />
        <Caption style={styles.caption}>If you are aware of the Matatu's vehicle registration number, you can opt to jus fill it in now</Caption>
        <FAB 
          label="fill now"
          onPress={this.props.navigation.navigate.bind(this, "NumberPlate")}
          style={styles.fab}
        />
        <View style={styles.footer} />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
    // justifyContent: "center",
    // alignItems: "center",
  },
  caption: {
    marginStart: 16,
  },
  icon: {
    alignSelf: "center",
  },
  timer: {
    alignSelf: "stretch"
  },
  iconButton: {
    alignSelf: "center"
  },
  fab: {
    marginTop: 16,
    width: (Dimensions.get("window").width - 64),
    alignSelf: "center",
  },
  footer: {
    height: 0,
    marginBottom: 50
  },
});

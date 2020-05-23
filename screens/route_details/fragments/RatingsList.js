import React from 'react';
import { ToastAndroid, StyleSheet } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../theme';

class Message extends React.PureComponent {

  render() {
    return (
      <>
        <List.Item 
          left={props => <Icon {...props} name="face" size={30} style={styles.avatarIcon}/>}
          title={this.props.messageTitle}
          titleStyle={styles.titleStyle}
          description={this.props.comment}
          onPress={() => ToastAndroid.show(`show the ${this.props.messageTitle} thread`, ToastAndroid.SHORT)}
        />
        
      </>
    );
  }

}


export default class RatingsList extends React.PureComponent {

  _renderComments = () => {
    let comments = [];

    let messages = [
      "I am generally happy with you",
      "This is a simple I am angry message",
      "This is a simple you dont know what i am saying message",
      "Do you four even",
      "New Five, Who dis?",
    ];

    let titles = [
      "Happy Message",
      "Neutral Message",
      "IDK Message",
      "Message Four",
      "Five Message",
    ];

    for(let i=0; i<5; i++) {
      comments.push(
        <Message 
          messageTitle={titles[i]}
          comment={messages[i]}
          key={`${i}`}
        />
      );
    }

    return comments;
  }

  render() {

    return (
      <ScrollView>
        {this._renderComments()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  avatarIcon: {
    textAlignVertical: "center",
    color: Theme.PrimaryColor
  },
  titleStyle: {
    fontFamily: Theme.OpenSansBold
  },
});
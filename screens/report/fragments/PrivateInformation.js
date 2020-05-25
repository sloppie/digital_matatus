import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Switch, Card } from 'react-native-paper';

let TextInput = null;

export default class PrivateInformation extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      firstName: "",
      lastName: "",
      email: ""
    };

  }

  // used to control visibility of the private info TextInputs
  _togglePrivateInformation = () => this.setState({collapse: !this.state.collapse});

  // SETTERS for the TextInputs
  _handleFirstName = (firstName) => this.setState({firstName});

  _handleLatstName = (lastName) => this.setState({lastName});

  _handleEmail = (email) => this.setState({email});

  // renders the text inputs of the visibility is allowed for
  _renderTextInputs = () => {
    let textInputs = [];

    if(!TextInput)
      TextInput = require("react-native-paper").TextInput;
    
    // First Name
    textInputs.push(
      <TextInput
        value={this.state.firstName}
        style={styles.textInput}
        placeholder="First name"
        onChange={this._handleFirstName}
        mode="outlined"
        label="First Name"
        key="1"
      />
    );

    // Last Name
    textInputs.push(
      <TextInput
        value={this.state.lastName}
        style={styles.textInput}
        placeholder="Last name"
        onChange={this._handleLastName}
        mode="outlined"
        label="Last Name"
        key="2"
      />
    );

    // email
    textInputs.push(
      <TextInput
        value={this.state.email}
        style={styles.textInput}
        placeholder="email@example.com"
        onChange={this._handleEmail}
        mode="outlined"
        label="email"
        keyboardType="email-address"
        key="3"
      />
    );

    return textInputs;
  }

  render() {

    return (
      <View style={styles.container}>
        <Card.Title 
          title="Private Information"
          titleStyle={(this.state.collapse)? styles.disabledTitle: styles.activeTitle}
          subtitle="This is turned off by default to mantain anonimity"
          right={props => <Switch {...props} value={!this.state.collapse} onValueChange={this._togglePrivateInformation}/>}
        />
        {(this.state.collapse)? null: this._renderTextInputs()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  disabledTitle: {
    color: "#999",
  },
  activeTitle: {
    color: "#444",
  },
});

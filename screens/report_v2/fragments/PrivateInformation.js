import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {
  Switch, Card, Colors, Caption, FAB, Title, Headline, Button, List, Divider,
  TouchableRipple,
} from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../../theme';


let TextInput = null;

const queryTitles = Object.freeze({
  incidentDescriptionQueries: "Incident Description",
  culpritDescriptionQueries: "Perpetrator Description",
  privateInformationQueries: "Private Information"
});

const queryTabNames = Object.freeze({
  incidentDescriptionQueries: "IncidentDescription",
  culpritDescriptionQueries: "CulpritDescription",
  privateInformationQueries: "PrivateInformation"
});

export default class PrivateInformation extends React.PureComponent {

  bottomSheetRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      collapse: true, // if it is collapsed , then it means the user doesnt want to share private information
      firstName: "",
      lastName: "",
      email: "",
      submitDisabled: true,
      activeSnap: 0, // this will be used with the mechanical snapping of the BottomSheet
      queries: null, // this is the queries from the data that is to be submitted 
    };

  }

  // used to control visibility of the private info TextInputs
  _togglePrivateInformation = () => this.setState({collapse: !this.state.collapse});

  // SETTERS for the TextInputs
  _handleFirstName = (firstName) => this.setState({firstName});

  _handleLastName = (lastName) => this.setState({lastName});

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
        onChangeText={this._handleFirstName}
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
        onChangeText={this._handleLastName}
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
        onChangeText={this._handleEmail}
        mode="outlined"
        label="email"
        keyboardType="email-address"
        key="3"
      />
    );

    return textInputs;
  }

  _MBSheetOpenEnd = () => {
    this.setState({activeSnap: 2});
  }

  _MBSheetOpenStart = () => {
    this.setState({activeSnap: 1, bottomSheetVisible: true});
  }

  _BSLayout = ({nativeEvent}) => {
    console.log(nativeEvent);
  }

  _renderHeader = () => (
    this.state.activeSnap < 2 ?
      <View style={styles.bottomSheetHeader}>
        <Button 
          icon="chevron-up" 
          size={30} 
          color={Theme.PrimaryColor}
          onPress={this._viewAllQueries}>
            Expand
        </Button>
        {/* {
          !this.state.submitDisabled?
            <Button 
              style={{}} 
              mode="contained"
              disabled={this.state.submitDisabled}
              onPress={this._submit}>
                Submit
            </Button>
          : null
        } */}
      <View style={styles.bottomSheetHeaderFull}>
        <Title style={{textAlign: "center", flex: 5}}>Submit Report</Title>
        <Button 
          style={styles.headerButton} 
          mode="contained"
          disabled={this.state.submitDisabled}
          onPress={this._submit}>
            Submit
        </Button>
        <Divider />
      </View>
      </View>
    :
      <View style={styles.bottomSheetHeaderFull}>
        <Title style={{textAlign: "center", flex: 5}}>Submit Report</Title>
        <Button 
          style={styles.headerButton} 
          mode="contained"
          disabled={this.state.submitDisabled}
          onPress={this._submit}>
            Submit
        </Button>
        <Divider />
      </View>
  );

  _renderQueryBadges = () => {
    
    if(this.state.queries !== null) {

      let badges = Object.keys(this.state.queries).map((query, index) => (
        this.state.queries[query].length > 0 ?
         <List.Item 
          left={props => <List.Icon {...props} icon="file-alert-outline" color={Colors.red500} />}
          title={`${queryTitles[query]} warnings`}
          description={`Queries with regard to the ${queryTitles[query]} information input.`}
          onPress={this._viewAllQueries}
          key={index.toString()}
         />
        : null
      ));

      return badges;
    } else {
      return (
        <Headline>No impending Queries</Headline>
      );
    }

  }

  _renderAllQueries = () => (
    Object.keys(this.state.queries).map(query => {
      
      if(this.state.queries[query].length) {
        return (
          <View key={`${queryTitles[query]}_warnings`}>
            <List.Section
              title={`${queryTitles[query]} warnings`}
            />
            {this.state.queries[query].map((iq, index) => (
              <List.Item 
                left={props => <List.Icon {...props} icon="alert-outline" color={iq.priority? "red": "blue"} size={30} />}
                title={iq.title}
                description={iq.description}
                onPress={this._navigateToQuery.bind(this, query)}
                key={`query${index.toString()}`}
              />
            ))}
          </View>
        );
      } else {
        return null;
      }

    })
  );

  _viewAllQueries = () => {
    this.bottomSheetRef.current.snapTo(2);
    this.setState({activeSnap: 2});
  }

  _navigateToQuery = (query) => {
    // close BottomSheet
    this.bottomSheetRef.current.snapTo(0);
    // this was set because the 
    this.setState({activeSnap: 0})
    // navigate back to the query
    this.props.navigation.navigate(queryTabNames[query]);
  }

  _renderContent = () => (
    <View>
      {
        (this.state.activeSnap < 2) && (
          <View 
            style={styles.bottomSheetContent}
          >
            <Headline style={styles.bottomSheetTitle}>Pending Issues</Headline>
            {this._renderQueryBadges()}
          </View>
        )

      }
      {
        this.state.activeSnap === 2 && (
          <View style={styles.bottomSheetContentFull}>
            {this._renderAllQueries()}
          </View>
        )
      }
    </View>
  );

  _collapseOverlay = () => {
    this.bottomSheetRef.current.snapTo(0);
    this.setState({bottomSheetVisible: false});
  }

  _getInformation = () => {
    
    if(this.state.collapse) {
      return null; // returns null if there is no private information to be returned
    } else {
      let isEmpty = this.state.email == "" || this.state.firstName == "" || this.state.lastName == "";
      
      if(isEmpty) {
        return "NOT_INPUT"; // flag used to communicate state
      } else {
        let {email, firstName, lastName} = this.state;

        return {email, firstName, lastName}; // return user information
      }

    }

  }

  _verifyInformation = () => {
    let response = this.props._getInformation();
    // console.log("Submit disabled: " + submitDisabled);

    // the block below makes it easier to render if there are no impending queries
    let submitDisabled = Object.keys(response.queries).some(query => response.queries[query].some(alerts => alerts.priority));
    if(response.has_query)
      this.setState({bottomSheetVisible: true, submitDisabled, queries: response.queries});
    else
      this.setState({bottomSheetVisible: true, submitDisabled: false});

    this.bottomSheetRef.current.snapTo(1);
  }

  _submit = () => { 
    this.bottomSheetRef.current.snapTo(0);
    this.setState({activeSnap: 0});
    this.props._sendVerifiedData(); // send the data
  }

  render() {

    return (
      <>
        <View style={styles.container}>
          <Card.Title 
            title="Private Information"
            titleStyle={(this.state.collapse)? styles.disabledTitle: styles.activeTitle}
            subtitle="This is turned off by default to mantain anonimity"
            right={props => (
              <Switch
                {...props}
                value={!this.state.collapse}
                onValueChange={this._togglePrivateInformation}
              />
            )}
          />
          {(!this.state.collapse) && this._renderTextInputs()}
          {
            (this.state.collapse) && (
              <View style={styles.incognitoContainer}>
                <Icon name="incognito" style={styles.incognitoIcon} size={100} />
                <Caption style={styles.incognitoCaption}>
                  Your information will not be shared in the report filed
                </Caption>
                <Caption style={styles.incognitoCaption}>
                  To share your information, please turn on the switch at the top
                </Caption>
              </View>
            )
          }
        </View>
        <FAB 
          icon="file-send"
          label="Verify Information"
          onPress={this._verifyInformation}
          style={styles.fab}
          mode="contained"
        />
          {/* Verify Information
        </Button> */}
        {this.state.bottomSheetVisible && (
              <TouchableRipple
                style={styles.overlay}
                onPress={this._collapseOverlay}
                rippleColor="#00000000">
                <View></View>
              </TouchableRipple>
        )}
        <BottomSheet 
          ref={this.bottomSheetRef}
          snapPoints={[0, "50%", "90%"]}
          initialSnap={0}
          onCloseEnd={() => this.setState(({bottomSheetVisible: false}))}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          style={styles.bottomSheet}
          onLayout={this._BSLayout}
          onOpenEnd={this._MBSheetOpenEnd}
          onOpenStart={this._MBSheetOpenStart}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    minHeight: "50%"
  },
  overlay: {
    // position: "absolute",
    ...StyleSheet.absoluteFill,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#00000080",
  },
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
  incognitoContainer: {
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    alignContent: "center",
    justifyContent: "center"
  },
  incognitoIcon: {
    textAlignVertical: "center",
    textAlign: "center",
    padding: 16,
  },
  incognitoCaption: {
    textAlign: "center",
  },
  fab: {
    elevation: 0,
    zIndex: 0,
    alignSelf: "center",
    width: Dimensions.get("window").width - 64,
    backgroundColor: "orange",
    // marginTop: 8,
  },
  bottomSheet: {
    elevation: 3,
    zIndex: 3,
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    flex: 1,
    height: Dimensions.get("window").height,
    position: "absolute",
  },
  bottomSheetHeader: {
    backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
    width: Dimensions.get("window").width,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  bottomSheetHeaderFull: {
    backgroundColor: "white",
    // alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: Dimensions.get("window").width,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 8,
  },
  headerButton: {
    alignSelf: "flex-end",
    marginRight: 16,
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: "white",
    alignSelf: "stretch",
    height: (Dimensions.get("window").height * 0.5),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  // for the full bottom sheet (screen 90%)
  bottomSheetContentFull: {
    backgroundColor: "white",
    alignSelf: "stretch",
    height: Dimensions.get("window").height,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  bottomSheetTitle: {
    textAlign: "center",
  },
  submitButton: {
    alignSelf: "center",
    width: Dimensions.get("window").width - 64,
    marginTop: 8,
    backgroundColor: Theme.PrimaryColor,
  },
});

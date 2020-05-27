import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton, List, Divider } from 'react-native-paper';

const QUERY = Object.freeze({
  incidentDescriptionQueries: "Incident description queries",
  culpritDescriptionQueries: "Culprit description queries",
  privateInformationQueries: "Private inforamtion queries"
});


export default class DataVerification extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      loading: true, // prevent premature loading of the button
      disable: false, // this disables the submit button and unverifies the data
    };
  }

  _scrollTo = (tabName, priority) => {
    this.props._scrollTo(tabName); // Scroll back to the index given

    // unverify data so as to make sure the user is not able to complete without fixing the issues
    if(priority)
      this.props._unverifyData(); 
  }

  _generateQueries = () => {
    let queries = [];
    let HIGH_PRIORITY = false;

    for(let i in this.props.queries) {
      let tabName = ( // create tab name to enable easy scrolling back
        (i == QUERY.incidentDescriptionQueries) ? "IncidentDescription"
        : (i == QUERY.culpritDescriptionQueries) ? "CulpritDescription"
        : "PrivateInformation"
      );

      queries.push(
        <List.Section 
          title={QUERY[i]}
        />
      );

      let sectionQueries = this.props.queries[i].map((query, index) => {

        if(!HIGH_PRIORITY)
          HIGH_PRIORITY = query.priority;

        return (
          <List.Item 
            title={query.title}
            description={query.description}
            onPress={this._scrollTo.bind(this, tabName, query.priority)}
            key={index.toString()}
          />
        );
      });
    
      queries = [...queries, ...sectionQueries, <Divider />];
    }

    this.setState({loading: false, disable: true});

    return queries;
  }

  _generateButton = () => (
    <IconButton 
      icon="check"
      onPress={this.props._sendVerifiedData}
      disabled={this.state.disabled}
      size={50}
      style={styles.verifyButton}
    />
  );

  render() {

    return (
      <View style={styles.page}>
        {this._generateQueries()}
        {this._generateButton()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  page: {
    height: Dimensions.get("window").height,
  },
  verifyButton: {
    textAlign: "center",
    textAlignVertical: "center"
  },
});

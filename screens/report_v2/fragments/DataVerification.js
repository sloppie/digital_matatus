import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { IconButton, List, Divider, Caption, Card, Colors } from 'react-native-paper';

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
      noQueries: (Object.keys(this.props.queries).length == 0)
    };
  }

  componentDidMount() {
    this.setState({loading: false, queries: this.props.queries});
  }

  _scrollTo = (tabName, priority) => {
    console.log(`Scrolling to: ${tabName}`)
    this.props._scrollTo(tabName); // Scroll back to the index given

    // unverify data so as to make sure the user is not able to complete without fixing the issues
    setTimeout(() => this.props._unverifyData(), 100)
      // this.props._unverifyData(); 
  }

  _generateQueries = () => {
    let queries = [];
    let HIGH_PRIORITY = false;
    let id = 0;

    if(this.state.noQueries)
      return queries;
    
    queries.push(
      <Caption style={styles.instructions}>Tap on a query to navigate to it</Caption>
    );

    for(let i in this.state.queries) {
      let tabName = ( // create tab name to enable easy scrolling back
        (i == "incidentDescriptionQueries") ? "IncidentDescription"
        : (i == "culpritDescriptionQueries") ? "CulpritDescription"
        : "PrivateInformation"
      );

      queries.push(
        <List.Section 
          title={QUERY[i]}
          key={id.toString()}
        />
      );

      id++;

      let sectionQueries = this.state.queries[i].map((query, index) => {

        if(!HIGH_PRIORITY)
          HIGH_PRIORITY = query.priority;

        id++;
        return (
          <List.Item 
            title={query.title}
            titleNumberOfLines={2}
            description={query.description}
            descriptionNumberOfLines={3}
            onPress={this._scrollTo.bind(this, tabName, query.priority)}
            left={props => <List.Icon {...props} icon="information" color={query.priority ? Colors.red600: Colors.blue500} />}
            key={id.toString()}
          />
        );
      });
    
      id++;
      queries = [...queries, ...sectionQueries, <Divider key={id.toString()} />];
      id++;
    }

    this.setState({disable: HIGH_PRIORITY});

    return queries;
  }

  _generateButton = () => (
    <IconButton 
      icon="check"
      onPress={this.props._sendVerifiedData}
      disabled={this.state.disable}
      size={50}
      style={styles.verifyButton}
      color={this.state.disable? Colors.grey400: Colors.red600}
    />
  );

  render() {

    if(this.state.loading)
      return <ActivityIndicator size="large"/>

    return (
      <ScrollView style={[styles.page, this.state.noQueries? styles.completePage: {}]}>
        {this._generateQueries()}
        {
          (this.state.noQueries)
          ? <Card.Title 
              title={"Done!"}
              subtitle={"press the button to submit the report"}
            />
          : null
        }
        {this._generateButton()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  page: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
  },
  completePage: {
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButton: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    backgroundColor: Colors.blue100
  },
});

import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

export default class MockRouteCard extends React.PureComponent {

  turnOffInterval = null;

  turnOnInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
    };
  }
  
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <View 
        style={styles.routeCard}
      >
        <View 
          style={styles.headerContainer}
        >
          <View style={[styles.icon, {display: (this.state.isVisible)? "flex": "none"}]} />
          <View style={[styles.textContainers, {display: (this.state.isVisible)? "flex": "none"}]} >
            <View style={styles.headerTextContainer}></View>
            <View style={styles.subtitleTextContainer}></View>
          </View>
          <View style={[styles.icon, {backgroundColor: "#f44336", opacity: 0.6}]}/>
        </View>
        <View style={styles.button} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  routeCard: {
    width: (Dimensions.get("window").width - 32),
    height: 130,
    elevation: 1,
    backgroundColor: "white",
    alignSelf: "center",
    position: "absolute",
    bottom: 16,
    borderRadius: 8,
  },
  headerContainer: {
    width: (Dimensions.get("window").width - 32),
    height: Math.floor(0.3 * 130),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    backgroundColor: "#f2f2f2",
    width: Math.floor(0.4 * 130),
    height: Math.floor(0.4 * 130),
    margin: 8,
    borderRadius: 100,
  },
  textContainers: {
    marginTop: 8,
    width: (Dimensions.get("window").width - 32 - Math.floor(0.8 * 130) - 32),
    height: Math.floor(0.4 * 130),
  },
  headerTextContainer: {
    marginBottom: 2,
    height: 22,
    backgroundColor: "#f2f2f2",
  },
  subtitleTextContainer: {
    marginTop: 2,
    height: 22,
    width: (Math.floor(0.4 * 130) * 2),
    backgroundColor: "#f2f2f2",
  },
  button: {
    position: "relative",
    backgroundColor: "#b71c1c",
    opacity: 0.4,
    height: Math.floor(0.2 * 130),
    width: Math.floor((Dimensions.get("window").width - 32) * 0.4),
    marginStart: 16,
    top: Math.floor(0.4 * 130),
  },
});

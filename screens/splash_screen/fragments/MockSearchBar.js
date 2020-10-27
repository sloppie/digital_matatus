import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';


export default class MockHeader extends React.PureComponent {

  render() {

    return (
      <View 
        style={styles.appBar}>
          <View 
            style={styles.searchBar}
          >
            <View style={styles.innerIcon}/>
            <View style={styles.innerText}/>
          </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  appBar: {
    position: "absolute",
    height: 56,
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 48,
    width: (Dimensions.get("window").width - 32),
    top: 8,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    flexDirection: "row",
  },
  innerIcon: {
    height: 32,
    width: 32,
    marginTop: 8,
    marginBottom: 8,
    marginStart: 16,
    marginEnd: 8,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  innerText: {
    height: 32,
    width: 100,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: "#f2f2f2",
  },
});
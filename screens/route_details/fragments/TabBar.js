import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { TouchableRipple, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../theme';


export default class TabBar extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
  }

  _setActiveTab = (index) => {
    this.setState({
      activeTab: index
    });

    this.props.actions[index]();
  }

  _renderTabs = () => {
    let tabs = [];

    this.props.tabs.forEach((tab, index) => {
      let activeTab = index == this.state.activeTab;
      tabs.push(
        <TouchableRipple
          style={(activeTab)? styles.activeTab: styles.tab}
          onPress={this._setActiveTab.bind(this, index)}
        >
          <>
          <Icon 
            style={(activeTab)? styles.activeTabIcon:styles.tabIcon}
            name={this.props.icons[index]} 
            size={30}/>
          <Text style={(activeTab)? styles.activeTabLabel: styles.tabLabel}>{tab}</Text>
          </>
        </TouchableRipple>
      )
    });

    return tabs;
  }

  render() {

    return (
      <View style={styles.tabBar}>
        {this._renderTabs()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  tabBar: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: Colors.green700,
    // borderBottomColor: Theme.PrimaryColor
  },
  tab: {
    alignSelf: "stretch",
    width: "33%",
    paddingBottom: 8,
    paddingTop: 8
  },
  activeTab: {
    alignSelf: "stretch",
    width: "33%",
    paddingBottom: 8,
    paddingTop: 8,
    borderBottomWidth: 3,
    borderBottomColor: Colors.green700,
  },
  tabIcon: {
    alignSelf: "center",
  },
  activeTabIcon: {
    alignSelf: "center",
    color: Colors.green700,
  },
  tabLabel: {
    textAlign: "center",
  },
  activeTabLabel: {
    textAlign: "center",
    color: Colors.green700,
  }
});

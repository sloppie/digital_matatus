import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { List, Colors, Divider, Checkbox } from 'react-native-paper';

import categoryFlags from './utilities/category-flags';
import Flags from './utilities/flag-context';


class Flag extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.active,
    };
  }

  _updateFlags = () => {
    requestAnimationFrame(() => {
      this.setState({selected: !this.state.selected});
  
      this.props.updateFlags(this.props.index);
    });
  }


  render() {

    return (
      <>
      <List.Item
        left={props => 
          <Checkbox {...props} status={this.state.selected? "checked": "unchecked"} />
        }
        title={this.props.example}
        titleStyle={styles.flagTitle}
        titleNumberOfLines={3}
        onPress={this._updateFlags}
        underlayColor={Colors.red600}
        // right={props => (
        //   <List.Icon
        //     {...props}
        //     icon="flag-triangle"
        //     color={this.state.selected ? Colors.red600 : Colors.grey500}
        //     size={24}
        //   />
        // )}
      />
      <Divider />
      </>

    );
  }

}


class HarassmentDecription extends React.PureComponent {

  _categoryExamples = null;

  constructor(props) {
    super(props);

    if (this.props.discriminationCategory === "Sexual Discrimination & Harrasment") {
      this._categoryExamples = categoryFlags.SD
    } else if (this.props.discriminationCategory === "Discrimination based on tribe/race") {
      this._categoryExamples = categoryFlags.RD;
    } else {
      this._categoryExamples = categoryFlags.PD;
    }

    let flags = [];

    for(let i=0; i<this._categoryExamples[this.props.category].length; i++) {
      flags.push(false);
    }

    this.state = {
      "flags": [flags],
      loading: true
    };
  }

  componentDidMount() {

    this.setState({loading: false})
  }

  _updateFlags = (index) => {
    // let lastFlag = this.state.flags[this.state.flags.length - 1];
    // let flags = [...this.state.flags]; // unpack last stored flags
    // lastFlag[index] = !lastFlag[index];
    // flags.push(lastFlag);

    // this.setState({flags});
    this.props.updateCurrentSetFlags(this.props.category, index);
  }

  // maps all the examples to the section
  _renderFlags = (category, setFlags) => 
    this._categoryExamples[category].map((example, index) => (
        <Flag 
          example={example} 
          index={index} 
          updateFlags={this._updateFlags} 
          key={index.toString()}
          active={setFlags[index]}
        />
      ));

  _returnSetFlags = () => {
    let lastSet = this.state.flags[this.state.flags.length - 1];
    let set = lastSet.map((flag, index) => (
      (flag) ? this._categoryExamples[this.props.category][index]: null
    )).filter(flag => flag !== null);

    return set;
  }

  render() {
    let value = this.context;

    console.log(JSON.stringify(value));

    return(
      <>
        <List.Section
          title={`${this.props.category} Harassment Flags`}
        >
        </List.Section>
        {/* <Divider /> */}
          {(this.state.loading)
              ? <ActivityIndicator size="large"/>
              : this._renderFlags(this.props.category, value[this.props.category])
            }
      </>
    );
  }

}

const styles = StyleSheet.create({
  flagContainer: {
    // flexDirection: "row",
  },
  flagIcon: {
    padding: 8
  },
  flagTitle: {
    fontSize: 13
  },
});

HarassmentDecription.contextType = Flags;

export default HarassmentDecription;

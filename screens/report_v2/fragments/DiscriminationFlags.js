import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { List, Colors, Checkbox, Divider } from 'react-native-paper';

import categoryFlags from './utilities/category-flags';


function DiscriminationFlags({category, discriminationCategory}) {
  let DC = null;

  if (discriminationCategory === "Sexual Discrimination & Harrasment") {
    DC = categoryFlags.SD
  } else if (discriminationCategory === "Discrimination based on tribe/race") {
    DC = categoryFlags.RD;
  } else {
    DC = categoryFlags.PD;
  }

  this.setCategoryFlags = {
    
  };

  const [setCategoryFlags, setSetCategoryFlags] =
      useState([DC[category].map(val => false)]);

  const toggleActive = (index, value) => {
    const previouslySet = setCategoryFlags[setCategoryFlags.length - 1];
    previouslySet[index] = value;
    setSetCategoryFlags([...setCategoryFlags, previouslySet]);
  };

  return (
    <>
      <List.Section title={`${category} Flags`}></List.Section>
          {
              DC[category].map((discriminationFlag, i) => {
                // console.log(`category: ${DC[category][i]}: status: ${flags[category][i]}`);
                return (
                  <Flags 
                    key={i.toString()}
                    discriminationFlag={discriminationFlag}
                    category={category}
                    toggleActive={toggleActive}
                    status={setCategoryFlags[setCategoryFlags.length - 1][i]}
                    index={i}
                  />
                )
              })
            }
    </>
  );
}

DiscriminationFlags.prototype.getSelectedValues = function() {}

export default class RevisedDiscriminationFlags extends React.PureComponent {
  constructor(props) {
    super(props);

    let DC = null;

    if (props.discriminationCategory === "Sexual Discrimination & Harrasment") {
      DC = categoryFlags.SD
    } else if (props.discriminationCategory === "Discrimination based on tribe/race") {
      DC = categoryFlags.RD;
    } else {
      DC = categoryFlags.PD;
    }

    this.DC = DC;

    this.state = {
      allFlags: DC[props.category],
      selectedFlags: DC[props.category].map(val => false),
    };
  }

  toggleActive = (index, value) => {
    console.log("Toggling active check to: " + value);
    const {selectedFlags} = this.state;
    selectedFlags[index] = value;
    this.setState({selectedFlags});
  }

  getSetFlags = () => {
    const selected = [];
    for (let i=0; i<this.state.selectedFlags.length; i++) {
      if (this.state.selectedFlags[i]) {
        selected.push(this.state.allFlags[i]);
      }
    }

    return selected;
  }

  render() {
    return (
      <>
        <List.Section title={`${this.props.category} Flags`}></List.Section>
        {
            this.DC[this.props.category].map((discriminationFlag, i) => {
              // console.log(`category: ${DC[category][i]}: status: ${flags[category][i]}`);
              return (
                <Flags 
                  key={i.toString()}
                  discriminationFlag={discriminationFlag}
                  category={this.props.category}
                  toggleActive={this.toggleActive}
                  status={this.state.selectedFlags[i]}
                  index={i}
                />
              )
            })
          }
      </>
    )
  }
}


function Flags({discriminationFlag, toggleActive, index}) {

  const [isChecked, setIsChecked] = useState(false);

  function select() {
    const newVal = !isChecked;
    setIsChecked(newVal);
    toggleActive(index, newVal);
  }

  return (
    <View>
      <List.Item
        left={props => 
          <Checkbox {...props} status={isChecked? "checked": "unchecked"} color="purple" onPress={select}/>
        }
        title={discriminationFlag}
        titleStyle={styles.flagTitle}
        titleNumberOfLines={3}
        onPress={select}
        underlayColor={Colors.red600}
      />
      <Divider />
    </View>
  );
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

// export default DiscriminationFlags;

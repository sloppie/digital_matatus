import React from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Touchable, ToastAndroid,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {
  Card, Chip, IconButton, Colors, Menu, Paragraph, Title, TextInput, List,
  TouchableRipple, Divider, Caption, FAB,
} from 'react-native-paper';

import Theme from '../../../theme';
import DiscriminationFlags from './DiscriminationFlags';
import discriminationFlags from './utilities/category-flags';


export default class Chips extends React.PureComponent {

  discriminationFlagsRef = React.createRef();
  verbalFlagsRef = React.createRef();
  nonVerbalFlagsRef = React.createRef();
  physicalFlagsRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      chips: {},
      menuOpen: false,
      selectedCategory: "--select type--",
      flags: {
        "Verbal": [],
        "Non-verbal": [],
        "Physical": [],
      },
    };

  }

  componentDidMount() {
    let activeObject = {};
    Object.keys(this.props.flags).forEach(flag => activeObject[flag] = false);
    this.setState({chips: this.props.flags, loading: false, ...activeObject});
  }

  _toggleChip = (chipName) => {
    this.props.toggleFlag(chipName);

    // each chip gets its own variable in state to make sure it is updated on each state change
    this.setState({[chipName]: !this.state[chipName]});
  }

  _findDefinition = (chipName) => this.props.secondaryNavigation.navigate("CategoryDefinition", {category: chipName});

  _allDefinitions = () => {
    requestAnimationFrame(() => {
      this.props.secondaryNavigation.navigate(
        "CategoryDefinition",
        {category: this.state.selectedCategory});
    });
  }

  _renderChips = () => {
    let chips = [];
    
    for(let chipName in this.props.flags) {
      chips.push(
        <Chip 
          style={styles.chip}
          selected={this.state[chipName]}
          onPress={this._toggleChip.bind(this, chipName)}
          // onLongPress={this._findDefinition.bind(this, chipName)}
          key={chipName}
          // selectedColor="purple"
          selectedColor="purple"
          
        >
          {chipName}
        </Chip>
      );
    }

    return chips;
  }

  _renderCategoryInput = () => {
    return (
      <TextInput
        value={this.state.selectedCategory}
        label="Discrimination Category (Required)"
        mode="outlined"
      />
    );
  }


  _renderMenu = () => {

    return (
      <Menu
        contentStyle={styles.menu}
        visible={this.state.menuOpen}
        onDismiss={this.closeMenu}
        anchor={
          <TouchableHighlight underlayColor="pink" style={styles.menuAnchor} onPress={this.openMenu}>
            <List.Icon icon="arrow-down-drop-circle-outline" color="purple" />
          </TouchableHighlight>
        }
      >
        <Menu.Item
          onPress={this._setCategory.bind(this, "Sexual Discrimination & Harrasment")}
          title="Sexual Discrimination & Harrasment"
          titleStyle={styles.menuItem}
          />
        <Menu.Item
          onPress={this._setCategory.bind(this, "Discrimination on Physical Disability")}
          title="Discrimination on Physical Disability"
          titleStyle={styles.menuItem}
          />
        <Menu.Item
          onPress={this._setCategory.bind(this, "Discrimination based on tribe/race")}
          title="Discrimination based on tribe/race"
          titleStyle={styles.menuItem}
          />
      </Menu>
    );
  }

  // the methods below handle the pop-up menu that comes up for the selection
  closeMenu = () => {
    this.setState({menuOpen: false});
  }

  openMenu = () => this.setState({menuOpen: true});

  _setCategory = (category) => {
    const discriminationCategory = category;

    let DC = null;
    if (discriminationCategory === "Sexual Discrimination & Harrasment") {
      DC = discriminationFlags.SD;
    } else if (discriminationCategory == "Discrimination on Physical Disability") {
      DC = discriminationFlags.PD;
    } else {
      DC= discriminationFlags.RD;
    }
    const flags = {
      "Verbal": DC.Verbal.map(val => false),
      "Non-verbal": DC["Non-verbal"].map(val => false),
      "Physical": DC.Physical.map(val => false),
    }
    
    this.setState({
      selectedCategory: category,
      menuOpen: false,
      flags,
    });

    // this.props.setDiscriminationCategory(category);
  }

  updateCurrentSetFlags = (category, index) => {
    const flags = {...this.state.flags};
    flags[category][index] = !this.state.flags[category][index];

    this.setState({flags});
  }

  _getInformation = () => {
    const response = {
      discriminationCategory: this.state.selectedCategory,
      flags: {},
    };

    if (this.state.Verbal) {
      const verbal = this.verbalFlagsRef.current.getSetFlags();
      if (verbal) {
        response.flags.Verbal = verbal;
      }
    }

    if (this.state["Non-verbal"]) {
      const nonVerbal = this.nonVerbalFlagsRef.current.getSetFlags();
      if (nonVerbal) {
        response.flags["Non-verbal"] = nonVerbal;
      }
    }

    if (this.state.Phyical) {
      const physical = this.physicalFlagsRef.current.getSetFlags();
  
  
      if (physical) {
        response.flags.Phyical = physical;
      }
    }

    return response;
  }

  _navigateNext = () => {
    if (this.state.selectedCategory == "--select type--") {
      ToastAndroid.show("Please select a category from the dropdown", ToastAndroid.SHORT);
    } else {
      this.props.navigation.navigate("MediaAttachment");
    }
  }

  render() {

    return (
      <>
        <ScrollView style={{width: "100%", flex: 1}}>
          <Card style={styles.card}>
            <Text style={styles.screenTitle}>Incident Brief</Text>
            <Caption style={styles.screenCaption}>
              In this tab, you will fill in the details about what happened in the incident
          </Caption>
            <Divider />
            <List.Section title="Discrimination Category" />
            <TouchableHighlight underlayColor="#00000000" onPress={this.openMenu}>
              <View style={styles.menuContainer}>
                <Text style={styles.selectedCategoryText}>{this.state.selectedCategory}</Text>
                {this._renderMenu()}
              </View>
            </TouchableHighlight>
            {
              (this.state.selectedCategory !== "--select type--") && (
                <View>
                  <List.Item
                    title={this.state.selectedCategory}
                    titleStyle={styles.moreInfoCardTitle}
                    onPress={this._allDefinitions}
                    style={styles.moreInfoCard}
                    description="This is a description that is based on the dynamic category selected by the user"
                    left={(props) =>
                      <List.Icon
                        {...props}
                        icon="information-outline"
                        color="purple"
                        style={styles.menuInfoCardLeft}
                      />}
                  />

                  <Divider />

                  <Card.Title
                    style={styles.discriminationCard}
                    title="Discrimination Categories"
                    subtitle="Press on a category to select(Long press on a category to learn more)"
                    subtitleNumberOfLines={2}
                  />
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.chipContainer}>
                      {
                        this.state.loading && (
                          <ActivityIndicator size="large" style={styles.activityIndicator} />
                        )
                      }
                      {
                        !this.state.loading && this._renderChips()
                      }
                    </View>
                  </Card.Content>
                </View>
              )
            }
            {
              this.state.Verbal && (
                <DiscriminationFlags
                  ref={this.verbalFlagsRef}
                  category="Verbal"
                  discriminationCategory={this.state.selectedCategory}
                  updateCurrentSetFlags={this.updateCurrentSetFlags}
                  flags={this.state.flags}
                />
              )
            }
            {
              this.state["Non-verbal"] && (
                <DiscriminationFlags
                  ref={this.nonVerbalFlagsRef}
                  category="Non-verbal"
                  discriminationCategory={this.state.selectedCategory}
                  updateCurrentSetFlags={this.updateCurrentSetFlags}
                  flags={this.state.flags}
                />
              )
            }
            {
              this.state.Physical && (
                <DiscriminationFlags
                  ref={this.physicalFlagsRef}
                  category="Physical"
                  discriminationCategory={this.state.selectedCategory}
                  updateCurrentSetFlags={this.updateCurrentSetFlags}
                  flags={this.state.flags}
                />
              )
            }
          </Card>
          <FAB
            style={{
              width: Dimensions.get("window").width - 72,
              alignSelf: "center",
              elevation: 0,
              backgroundColor: "orange",
              marginTop: 32,
              marginBottom: 16,
            }}
            mode="contained"
            label="Next"
            icon="chevron-right"
            onPress={this._navigateNext} />
        </ScrollView>
      </>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    elevation: 0,
    paddingLeft: 16,
    backgroundColor: "#ffffff00",
  },
  screenTitle: {
    fontSize: 48,
    marginBottom: 0,
    fontFamily: Theme.OpenSansBold,
  },
  screenCaption: {
    marginBottom: 8,
  },
  cardContent: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  menuContainer: {
    borderWidth: 2,
    borderColor: "purple",
    borderRadius: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: (Dimensions.get("window").width - 32),
  },
  menu: {
    backgroundColor: "#000",
    borderTopEndRadius: 32,
  },
  menuAnchor: {
    position: "relative",
    borderRadius: 32,
  },
  selectedCategoryText: {
    marginLeft: 16,
    fontSize: 18,
  },
  chipContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  moreInfoCard: {
    marginTop: 16,
    paddingStart: 0,
    marginLeft: 0,
    marginBottom: 16,
    backgroundColor: "pink",
    width: (Dimensions.get("window").width - 32),
    borderRadius: 8,
    elevation: 3,
  },
  moreInfoCardTitle: {
    color: "purple",
  },
  menuInfoCardLeft: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "purple",
  },
  chip: {
    marginEnd: 8,
    marginBottom: 8,
    backgroundColor: "pink",
  },
  moreInfoIcon: {
    alignSelf: "flex-end",
  },
  menuItem: {
    color: "#f4f4f4"
  },
  discriminationCard: {
    elevation: 1,
    paddingStart: 0,
    marginLeft: 0,
    marginTop: 8
  },
});

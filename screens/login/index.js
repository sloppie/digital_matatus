import React from 'react';
import { 
  ScrollView, 
  SafeAreaView, 
  ImageBackground, 
  Dimensions, 
  StyleSheet, 
} from 'react-native';
import * as Fragments from './fragments';


export default class Login extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.scrollViewRef = React.createRef();
  }

  _setUserDetails = (user) => {
      this.scrollViewRef.current.scrollTo({
        x: Dimensions.get("window").width,
        y: 0,
        animated: true,
      });

    this.setState({user});
  }

  _goBack = () => this.scrollViewRef.current.scrollTo({
    x: 0,
    y: 0,
    animated: true
  });

  render() {

    return (
      // <SafeAreaView style={styles.screen}>
      //   {/* <ImageBackground
      //     source={require("../../assets/images/nairobi-transit.jpg")}
      //     style={styles.imageBackground}
      //   > */}
      //     <ScrollView
      //       style={styles.screen}
      //       ref={this.scrollViewRef}
      //       scrollEnabled={false}
      //       horizontal={true}
      //       pagingEnabled={true}
      //       nestedScrollEnabled={true}
      //     >
      //       <Fragments.LoginScreen
      //         _setUserType={this.props._setUserType}
      //         _setUserDetails={this._setUserDetails}
      //         navigation={this.props.navigation}
      //         scrollViewRef={this.scrollViewRef}
      //       />

      //       {
      //         (this.state.user)
      //         ? <Fragments.Confirm 
      //             user={this.state.user}
      //             _goBack={this._goBack}
      //           />
      //         : null
      //       }

      //     </ScrollView>
      //   {/* </ImageBackground> */}
      // </SafeAreaView>
      <Fragments.Tab 
        secondaryNavigation={this.props.navigation}
      />
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  imageBackground: {
    flex: 1,
    alignSelf: "stretch",
    width: null
  },
});

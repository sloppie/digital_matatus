import React from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Divider } from 'react-native-paper';
import * as Fragments from './fragments';
import { API } from '../../utilities';
import AsyncStorage from '@react-native-community/async-storage';
import Theme from '../../theme';

function BottomPad() {
  return (
    <View style={{height: 0, marginBottom: 80}}/>
  );
}

function TopPad() {
  return (
    <View 
      style={{
        height: 0, 
        borderBottomColor: "white", 
        borderBottomWidth: 1, 
        marginBottom: 8
      }} 
    />
  );
}


export default class ReportDetails extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      loading: true,
      errorLoading: false,
      routes: [],
      active: null,
    };
  }

  async componentDidMount() {
    let routes = JSON.parse(await AsyncStorage.getItem("favouriteRoutes"));
    this.setState({routes});

    // by default fetches data for the first route
    this._fetchRouteReports(routes[0].route_id);
  }

  _fetchRouteReports = (route_id) => {
    this.setState({loading: true, active: route_id})
    API.fetchRouteReports(
      route_id, // id of the report to be fetched
      this._setReportsData, // onSuccess
      this._setErrorLoading, // onFailure
    );
  }

  _setScrollableData = () => {}

  _setReportsData = (reports) => {
    
    let culpritDescription = JSON.parse(reports[0].culpritDescription);
    
    if(culpritDescription.routeID == this.state.active) {
      this.setState({reports, loading: false});
    } else {
      console.log(this.state.active);
    }

  }

  _fetchAllReports = () => {
    return new Promise((resolve, reject) => {
      let reports = {};
      let length = 0;

      this.state.routes.forEach(route => {
        API.fetchReportsByRoute(
          route.route_id,
          (data) => {reports[route_id] = data},
          () => {}
        );
      });

    });
  }

  _setErrorLoading = () => this.setState({errorLoading: true});

  _renderItem = ({item}) => (
    <Fragments.ReportCard 
      data={item}
      navigation={this.props.navigation}
    />
  );

  _keyExtractor = (item) => item._id;

  render() {

    if(this.state.loading || this.state.errorLoading)
      return (
        <SafeAreaView style={styles.screen}>
          {
            this.state.routes !== null ?
              <Fragments.RouteOptionsSlider 
                _fetchRouteReports={this._fetchRouteReports} 
                routes={this.state.routes}
                active={this.state.active}
              />
            : null
          }
          {
            this.state.loading?
              <ActivityIndicator 
                animating={true}
                size="large"
              />
            : <Fragments.ErrorScreen />
          }
        </SafeAreaView>
      );

    return (
      <SafeAreaView style={styles.screen}>
        <Fragments.RouteOptionsSlider 
          routes={this.state.routes} 
          _fetchRouteReports={this._fetchRouteReports}
          active={this.state.active}
        />
        {/* <FlatList 
          style={styles.flatList}
          data={this.state.reports}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ListHeaderComponent={<TopPad />}
          ListFooterComponent={<BottomPad />}
          ListEmptyComponent={<Fragments.NoData />}
        /> */}
        <Fragments.ReportsList 
          data={this.state.reports}
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    // backgroundColor: Theme.PrimaryColor,
    // backgroundColor: "#121212",
    height: "100%",
  },
  flatList: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 50,
    alignSelf: "stretch",
  },
});

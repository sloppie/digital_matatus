import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import {} from 'react-native-paper';
import * as Fragments from './fragments';
import { API } from '../../utilities';
import AsyncStorage from '@react-native-community/async-storage';

export default class ReportDetails extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      loading: true,
      errorLoading: false,
      routes: null
    };
  }

  async componentDidMount() {
    let routes = (await AsyncStorage.getItem("favouriteRoutes"));
    this.setState(routes);

    // by default fetches data for the first route
    API.fetchRouteReports(
      routes[0].route_id, // route_id
      this._setReportsData, // onSuccess
      this._setErrorLoading,
    );
  }

  _fetchRouteReports = (route_id) => {
    API.fetchRouteReports(
      route_id, // id of the report to be fetched
      this._setReportsData, // onSuccess
      this._setErrorLoading, // onFailure
    );
  }

  _setReportsData = (reports) => this.setState({reports, loading: false});

  _setErrorLoading = () => this.setState({errorLoading: true});

  _renderItem = ({item}) => (
    <Fragments.ReportCard 
      data={item}
    />
  );

  _keyExtractor = (item) => item._id;

  render() {

    if(this.state.loading || this.state.errorLoading)
      return (
        <SafeAreaView>
          {
            this.state.routes !== null ?
              <Fragments.RouteOptionsSlider 
                _fetchRouteReports={this._fetchRouteReports} 
                routes={this.state.routes}
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
      <>
        <Fragments.RouteOptionsSlider 
          routes={this.state.routes} 
          _fetchRouteReports={this._fetchRouteReports}
        />
        <FlatList 
          data={this.state.reports}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  screen: {},
});

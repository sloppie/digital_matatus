import React from 'react';
import StopsList from './StopsList';
import SaccoList from './SaccoList';
import RatingsList from './RatingsList'
// import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';


export default class ListView extends React.PureComponent {

  render() {

    return(
      <>
        {
          (this.props.name == "Stops")?
            <StopsList navigation={this.props.navigation} listItemAction={this.props.listItemAction} data={this.props.data}/>
          :(this.props.name == "Saccos")? <SaccoList navigation={this.props.navigation} />
          : <RatingsList navigation={this.props.navigation} route={this.props.route}/>
        }
        
      </>
    );
  }

}
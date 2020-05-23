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
          (this.props.name == "Stops")?<StopsList listItemAction={this.props.listItemAction} data={this.props.data}/>
          :(this.props.name == "Saccos")? <SaccoList />
          : <RatingsList />
        }
        
      </>
    );
  }

}
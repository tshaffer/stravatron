import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchActivitiesNearLocation } from '../actions/index';

import SummaryActivitiesContainer from './summaryActivitiesContainer';

class NearLocationSummaryActivitiesContainer extends Component {

  componentWillMount() {
    const targetRegion = JSON.parse(this.props.params.targetRegion);
    this.props.fetchActivitiesNearLocation(targetRegion);
  }

  render() {
    return (
      <SummaryActivitiesContainer
        activities={this.props.activities}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    activities: state.activities
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchActivitiesNearLocation},
    dispatch);
}

NearLocationSummaryActivitiesContainer.propTypes = {
  fetchActivitiesNearLocation: React.PropTypes.func.isRequired,
  activities: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(NearLocationSummaryActivitiesContainer);

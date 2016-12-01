import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchAndUpdateSummaryActivities } from '../actions/index';

import SummaryActivitiesContainer from './summaryActivitiesContainer';

class AllSummaryActivitiesContainer extends Component {

  componentWillMount() {
    this.props.fetchAndUpdateSummaryActivities();
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
  return bindActionCreators({fetchAndUpdateSummaryActivities},
    dispatch);
}

AllSummaryActivitiesContainer.propTypes = {
  fetchAndUpdateSummaryActivities: React.PropTypes.func.isRequired,
  activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(AllSummaryActivitiesContainer);

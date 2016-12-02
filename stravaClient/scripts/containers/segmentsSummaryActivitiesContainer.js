import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchSegmentsActivities } from '../actions/index';

import SummaryActivitiesContainer from './summaryActivitiesContainer';

class SegmentsSummaryActivitiesContainer extends Component {

  componentWillMount() {
    this.props.fetchSegmentsActivities(this.props.params.id);
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
  return bindActionCreators({fetchSegmentsActivities},
    dispatch);
}

SegmentsSummaryActivitiesContainer.propTypes = {
  fetchSegmentsActivities: React.PropTypes.func.isRequired,
  activities: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(SegmentsSummaryActivitiesContainer);

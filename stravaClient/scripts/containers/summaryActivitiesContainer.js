import React, { Component } from 'react';

import { hashHistory } from 'react-router';

import SummaryActivities from '../components/summaryActivities';

export default class SummaryActivitiesContainer extends Component {

  handleShowDetailedMap(activityId) {
    hashHistory.push('/detailedActivityContainer/' + activityId);
  }

  handleCreateSegments(activityId) {
    hashHistory.push('/activitySegmentCreatorContainer/' + activityId);
  }

  handleMapStarredSegments() {
    hashHistory.push('/mapStarredSegments');
  }

  handleMapSelectedRides(selectedActivityIds) {
    hashHistory.push('/mapOfRides/' + selectedActivityIds);
  }

  render() {
    return (
      <div>
          <SummaryActivities
            activities={this.props.activities}
            onShowDetailedMap={this.handleShowDetailedMap.bind(this)}
            onCreateSegments={this.handleCreateSegments.bind(this)}
            onMapStarredSegments={this.handleMapStarredSegments.bind(this)}
            onMapSelectedRides={this.handleMapSelectedRides.bind(this)}
          />
      </div>
    );
  }
}

SummaryActivitiesContainer.propTypes = {
  activities: React.PropTypes.object.isRequired
};

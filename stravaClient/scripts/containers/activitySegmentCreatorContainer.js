import { connect } from 'react-redux';

import ActivitySegmentCreator from '../components/activitySegmentCreator';

// import { loadDetailedActivity, setMapLatitudeLongitude,  } from '../actions/index';
// import { setSegmentEndPoint, setMapStreamIndex, setMapMarkerCoordinates } from '../actions/index';
import { loadDetailedActivity,  } from '../actions/index';
import { setMapStreamIndex, setMapMarkerCoordinates } from '../actions/index';
import { getActivity } from '../reducers/reducer_activities';
import { getEffortsForActivitySegments } from '../reducers/reducer_segment_efforts';
import { getSegmentEffortsForActivity} from '../reducers/reducer_segment_efforts';
import { setLocationCoordinates } from '../actions/index';

function mapStateToProps (state, ownProps) {
  return {
    activity: getActivity(state, ownProps.params.id),
    activities: state.activities,
    segments: state.segments,
    segmentEfforts: state.segmentEfforts,
    effortsForSegments: getEffortsForActivitySegments(state, ownProps.params.id),
    segmentEffortsForActivity: getSegmentEffortsForActivity(state, ownProps.params.id),
    mapLatitudeLongitude: state.mapLatitudeLongitude,
    segmentEndPoint: state.segmentEndPoint,
    mapStreamIndex: state.mapStreamIndex,
    activityLocations: state.activityLocations,
    mapMarkers: state.mapMarkers,
    locationCoordinates: state.locationCoordinates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadDetailedActivity: (activityId, markerCount) => {
      dispatch(loadDetailedActivity(activityId, markerCount));
    },
    onSetMapLatitudeLongitude: (activityId, markerIndex, latitudeLongitude) => {
      dispatch(setMapMarkerCoordinates(activityId, markerIndex, latitudeLongitude));
    },
    onSetMapStreamIndex: (streamIndex) => {
      dispatch(setMapStreamIndex(streamIndex));
    },
    onSetLocationCoordinates: (uiElement, coordinates) => {
      dispatch(setLocationCoordinates(uiElement, coordinates));
    }
  };
}

const ActivitySegmentCreatorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivitySegmentCreator);

export default ActivitySegmentCreatorContainer;
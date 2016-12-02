import { connect } from 'react-redux';

import DetailedActivity from '../components/detailedActivity';

import { loadDetailedActivity, setMapMarkerCoordinates, setMapStreamIndex }
  from '../actions/index';
import { getActivity } from '../reducers/reducer_activities';
import { getEffortsForActivitySegments } from '../reducers/reducer_segment_efforts';
import { getSegmentEffortsForActivity} from '../reducers/reducer_segment_efforts';

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
    mapMarkers: state.mapMarkers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadDetailedActivity: (activityId) => {
      dispatch(loadDetailedActivity(activityId));
    },
    onSetMapLatitudeLongitude: (activityId, latitudeLongitude) => {
      // dispatch(setMapLatitudeLongitude(latitudeLongitude));
      dispatch(setMapMarkerCoordinates(activityId, 0, latitudeLongitude));
    },
    onSetMapStreamIndex: (streamIndex) => {
      dispatch(setMapStreamIndex(streamIndex));
    }
  };
}

const DetailedActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailedActivity);

export default DetailedActivityContainer;
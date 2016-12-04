import { connect } from 'react-redux';

import DetailedActivity from '../components/detailedActivity';

import { loadDetailedActivity, setMapStreamIndex }
  from '../actions/index';
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
    segmentEndPoint: state.segmentEndPoint,
    mapStreamIndex: state.mapStreamIndex,
    activityLocations: state.activityLocations,
    locationCoordinates: state.locationCoordinates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadDetailedActivity: (activityId) => {
      dispatch(loadDetailedActivity(activityId));
    },
    onSetMapStreamIndex: (streamIndex) => {
      dispatch(setMapStreamIndex(streamIndex));
    },
    onSetLocationCoordinates: (uiElement, index, coordinates) => {
      dispatch(setLocationCoordinates(uiElement, index, coordinates));
    }
  };
}

const DetailedActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailedActivity);

export default DetailedActivityContainer;


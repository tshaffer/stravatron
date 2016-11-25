import { connect } from 'react-redux';

import CreateSegments from '../components/createSegments';

import { loadCreateSegments, setMapLatitudeLongitude, setMapStreamIndex } from '../actions/index';
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
        mapStreamIndex: state.mapStreamIndex,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoadCreateSegments: (activityId) => {
            dispatch(loadCreateSegments(activityId));
        },
        onSetMapLatitudeLongitude: (latitudeLongitude) => {
            dispatch(setMapLatitudeLongitude(latitudeLongitude));
        },
        onSetMapStreamIndex: (streamIndex) => {
            dispatch(setMapStreamIndex(streamIndex));
        }
    };
}

const CreateSegmentsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateSegments);

export default CreateSegmentsContainer;
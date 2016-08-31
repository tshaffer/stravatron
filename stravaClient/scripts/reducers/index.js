import {combineReducers} from 'redux';
import ActivitiesReducer from './reducer_activities';
import SegmentEffortsReducer from './reducer_segment_efforts';
import SegmentsReducer from './reducer_segments';
import EffortsForSegmentsReducer from './reducer_efforts_for_segments';

const rootReducer = combineReducers({
    activities: ActivitiesReducer,
    segmentEfforts: SegmentEffortsReducer,
    segments: SegmentsReducer,
    effortsForSegments: EffortsForSegmentsReducer
});

export default rootReducer;

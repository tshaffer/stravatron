import {combineReducers} from 'redux';
import ActivitiesReducer from './reducer_activities';
import SegmentEffortsReducer from './reducer_segment_efforts';
import SegmentsReducer from './reducer_segments';
import EffortsForSegmentsReducer from './reducer_efforts_for_segments';
import BaseMapSegmentsReducer from './reducer_base_map_segments';
import CustomMapSegmentsReducer from './reducer_custom_map_segments';

const rootReducer = combineReducers({
    activities: ActivitiesReducer,
    segmentEfforts: SegmentEffortsReducer,
    segments: SegmentsReducer,
    effortsForSegments: EffortsForSegmentsReducer,
    baseMapSegments: BaseMapSegmentsReducer,
    customMapSegments: CustomMapSegmentsReducer
});

export default rootReducer;

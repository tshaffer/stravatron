import {combineReducers} from 'redux';
import SummaryActivitiesReducer from './reducer_summary_activities';
import SegmentEffortsReducer from './reducer_segment_efforts';

const rootReducer = combineReducers({
    summaryActivities: SummaryActivitiesReducer,
    segmentEfforts: SegmentEffortsReducer
});

export default rootReducer;

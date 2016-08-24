import {combineReducers} from 'redux';
import SummaryActivitiesReducer from './reducer_summary_activities';

const rootReducer = combineReducers({
    summaryActivities: SummaryActivitiesReducer,
});

export default rootReducer;

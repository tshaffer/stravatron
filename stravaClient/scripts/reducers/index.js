import {combineReducers} from 'redux';
import ActivitiesReducer from './reducer_activities';
import SegmentEffortsReducer from './reducer_segment_efforts';
import SegmentsReducer from './reducer_segments';
import BaseMapSegmentsReducer from './reducer_base_map_segments';
import CustomMapSegmentsReducer from './reducer_custom_map_segments';
import DBReducer from './reducer_db';
import AthletesReducer from './reducer_athletes';
import SelectedAthleteReducer from './reducer_selected_athlete';
import MapLatitudeLongitudeReducer from './reducer_map_latitude_longitude';

const rootReducer = combineReducers({
    activities: ActivitiesReducer,
    segmentEfforts: SegmentEffortsReducer,
    segments: SegmentsReducer,
    baseMapSegments: BaseMapSegmentsReducer,
    customMapSegments: CustomMapSegmentsReducer,
    db: DBReducer,
    athletes: AthletesReducer,
    selectedAthlete: SelectedAthleteReducer,
    mapLatitudeLongitude: MapLatitudeLongitudeReducer
});

export default rootReducer;

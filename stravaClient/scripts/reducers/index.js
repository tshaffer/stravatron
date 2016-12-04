import {combineReducers} from 'redux';
import ActivitiesReducer from './reducer_activities';
import SegmentEffortsReducer from './reducer_segment_efforts';
import SegmentsReducer from './reducer_segments';
import BaseMapSegmentsReducer from './reducer_base_map_segments';
import CustomMapSegmentsReducer from './reducer_custom_map_segments';
import DBReducer from './reducer_db';
import AthletesReducer from './reducer_athletes';
import SelectedAthleteReducer from './reducer_selected_athlete';
import SegmentEndPointReducer from './reducer_segment_end_point';
import MapStreamIndexReducer from './reducer_map_stream_index';
import ActivityLocationsReducers from './reducer_activity_locations';
import MapMarkersReducer from './reducer_map_markers';
import LocationCoordinatesReducer from './reducer_location_coordinates';

const rootReducer = combineReducers({
  activities: ActivitiesReducer,
  segmentEfforts: SegmentEffortsReducer,
  segments: SegmentsReducer,
  baseMapSegments: BaseMapSegmentsReducer,
  customMapSegments: CustomMapSegmentsReducer,
  db: DBReducer,
  athletes: AthletesReducer,
  selectedAthlete: SelectedAthleteReducer,
  segmentEndPoint: SegmentEndPointReducer,
  mapStreamIndex: MapStreamIndexReducer,
  activityLocations: ActivityLocationsReducers,
  mapMarkers: MapMarkersReducer,
  locationCoordinates: LocationCoordinatesReducer
});

export default rootReducer;

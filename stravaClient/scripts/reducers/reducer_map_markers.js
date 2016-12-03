import { ADD_MAP_MARKERS, SET_MAP_MARKER_COORDINATES } from '../actions/index';

const initialState =
  {
    markersByActivity: {}
  };

export default function(state = initialState, action) {

  let newState = null;
  let newMarkersByActivity = null;
  let markers = null;

  switch (action.type) {

    case ADD_MAP_MARKERS: {

      newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      markers = action.payload.markers;
      newMarkersByActivity[action.payload.activityId] = markers;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }

    case SET_MAP_MARKER_COORDINATES: {

      newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      markers = newMarkersByActivity[action.payload.activityId];
      markers[action.payload.markerIndex].coordinates = action.payload.coordinates;
      markers[action.payload.markerIndex].locationIndex = action.payload.locationIndex;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }
  }

  return state;
}

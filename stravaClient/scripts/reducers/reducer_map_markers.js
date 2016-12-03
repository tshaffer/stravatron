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

      console.log("ADD_MAP_MARKERS");
      console.log(action);

      newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      markers = action.payload.markers;
      newMarkersByActivity[action.payload.activityId] = markers;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }

    case SET_MAP_MARKER_COORDINATES: {

      console.log("SET_MAP_MARKER_COORDINATES");
      console.log(action);

      newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      markers = newMarkersByActivity[action.payload.activityId];
      markers[action.payload.markerIndex].coordinates = action.payload.coordinates;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }
  }

  return state;
}

import { ADD_MAP_MARKERS, SET_MAP_MARKER_COORDINATES } from '../actions/index';

const initialState =
  {
    markersByActivity: {}
  };

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case ADD_MAP_MARKERS: {

      let newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      const markers = action.payload.markers;
      newMarkersByActivity[action.payload.activityId] = markers;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }

    case SET_MAP_MARKER_COORDINATES: {

      let newMarkersByActivity = Object.assign( {}, state.markersByActivity);

      let markers = newMarkersByActivity[action.payload.activityId];
      markers[action.payload.markerIndex] = action.payload.coordinates;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }
  }

  return state;
}

import { ADD_MAP_MARKERS } from '../actions/index';

const initialState =
  {
    markersByActivity: {}
  };

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case ADD_MAP_MARKERS: {

      let newMarkersByActivity = Object.assign( {}, state.markersByActivityId);

      const markers = action.payload.markers;
      newMarkersByActivity[action.payload.activityId] = markers;

      newState = {
        markersByActivity: newMarkersByActivity
      };
      return newState;

    }
  }

  return state;
}

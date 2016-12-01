import { SET_ACTIVITY_LOCATIONS } from '../actions/index';

import * as Converters from '../utilities/converters';

const initialState = [];

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case SET_ACTIVITY_LOCATIONS: {

      const stravaLocations = action.payload;

      let stravatronLocations = [];
      for (let i = 0; i < stravaLocations.length; i++) {

        const stravaLocation = stravaLocations[i];
        const latitude = stravaLocation[0];
        const longitude = stravaLocation[1];
        const stravatronLocation = Converters.stravatronCoordinateFromLatLng(latitude, longitude);

        stravatronLocations.push(stravatronLocation);
      }

      newState = Object.assign( [], stravatronLocations);
      return newState;
    }
  }

  return state;
}

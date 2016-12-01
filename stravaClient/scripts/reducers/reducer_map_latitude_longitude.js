import { SET_MAP_LATITUDE_LONGITUDE } from '../actions/index';

const initialState = [];

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case SET_MAP_LATITUDE_LONGITUDE: {
      newState = Object.assign( [], action.latitudeLongitude);
      return newState;
    }
  }

  return state;
}

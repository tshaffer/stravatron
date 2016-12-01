import { SET_SELECTED_ATHLETE } from '../actions/index';

const initialState = {};

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case SET_SELECTED_ATHLETE: {
      newState = Object.assign( {}, action.athlete);
      return newState;
    }
  }

  return state;
}

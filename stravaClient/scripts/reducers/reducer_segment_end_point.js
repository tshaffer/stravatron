import { SET_SEGMENT_END_POINT } from '../actions/index';

const initialState = [];

export default function(state = initialState, action) {

  let newState = null;

  switch (action.type) {

    case SET_SEGMENT_END_POINT: {
      newState = Object.assign( [], action.latitudeLongitude);
      console.log("reducer_segment_end_point");
      console.log(action.latitudeLongitude);
      return newState;
    }
  }

  return state;
}

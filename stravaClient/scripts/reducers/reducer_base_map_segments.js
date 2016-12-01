import { CLEAR_BASE_MAP_SEGMENTS, SET_BASE_MAP_SEGMENTS } from '../actions/index';

const initialState = [];

export default function(state = initialState, action) {

  let newState = state;

  switch (action.type) {

    case CLEAR_BASE_MAP_SEGMENTS: {
      return initialState;
    }

    case SET_BASE_MAP_SEGMENTS: {
      newState = [];

      action.baseMapSegments.forEach( baseMapSegment => {
        newState.push(baseMapSegment);
      });

      return newState;
    }
  }

  return state;
}
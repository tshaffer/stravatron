import { CLEAR_CUSTOM_MAP_SEGMENTS, SET_CUSTOM_MAP_SEGMENTS } from '../actions/index';

// needs rework - store custom map name as well, and account for the fact that in the future I'll want different custom maps (map data)
const initialState = [];

export default function(state = initialState, action) {

  let newState = state;

  switch (action.type) {

    case CLEAR_CUSTOM_MAP_SEGMENTS: {
      return initialState;
    }

    case SET_CUSTOM_MAP_SEGMENTS: {
      newState = [];

      action.customMapSegments.segments.forEach( customMapSegment => {
        newState.push(customMapSegment);
      });

      return newState;
    }
  }

  return state;
}

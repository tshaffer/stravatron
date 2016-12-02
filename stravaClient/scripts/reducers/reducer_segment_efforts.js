import { ADD_SEGMENT_EFFORTS } from '../actions/index';

const initialState =
  {
    segmentEffortsById: {}
  };

let newSegmentEffortsById = null;
let newState = null;

export default function(state = initialState, action) {

  switch (action.type) {

    case ADD_SEGMENT_EFFORTS: {
      newSegmentEffortsById = Object.assign( {}, state.segmentEffortsById);

      const segmentEfforts = action.segmentEfforts;
      segmentEfforts.forEach( (segmentEffort) => {
        newSegmentEffortsById[segmentEffort.id] = segmentEffort;
      });

      newState = {
        segmentEffortsById: newSegmentEffortsById
      };
      return newState;
    }
  }

  return state;
}

// Selectors
export const getSegmentEffortsForActivity = (state, activityId) => {

  let segmentEfforts = [];

  for (let segmentEffortId in state.segmentEfforts.segmentEffortsById) {
    const segmentEffort = state.segmentEfforts.segmentEffortsById[segmentEffortId];
    if (segmentEffort.activityId === activityId) {
      segmentEfforts.push(segmentEffort);
    }
  }

  return segmentEfforts;
};

export const getEffortsForActivitySegments = (state) => {

  let effortsForActivitySegments = {};

  for (let segmentEffortId in state.segmentEfforts.segmentEffortsById) {
    const segmentEffort = state.segmentEfforts.segmentEffortsById[segmentEffortId];

    const segmentId = segmentEffort.segmentId;

    if (!effortsForActivitySegments[segmentId] || !effortsForActivitySegments.hasOwnProperty(segmentId)) {
      effortsForActivitySegments[segmentId] = [];
    }
    let effortsForSegment = effortsForActivitySegments[segmentId];
    effortsForSegment.push(segmentEffort);
  }

  return effortsForActivitySegments;
};

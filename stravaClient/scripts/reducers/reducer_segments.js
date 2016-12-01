import { ADD_SEGMENTS, ADD_DETAILED_SEGMENT_ATTRIBUTES } from '../actions/index';

const initialState =
  {
    segmentsById: {}
  };

let newSegmentsById = null;
let newState = null;

export default function(state = initialState, action) {

  switch (action.type) {

    case ADD_SEGMENTS: {
      newSegmentsById = Object.assign( {}, state.segmentsById);

      const segments = action.segments;
      segments.forEach( (segment) => {
        newSegmentsById[segment.id] = segment;
      });

      newState = {
        segmentsById: newSegmentsById
      };
      return newState;
    }

    case ADD_DETAILED_SEGMENT_ATTRIBUTES: {

      newSegmentsById = Object.assign( {}, state.segmentsById);

      action.detailedSegmentsAttributes.forEach( (detailedSegmentAttributes) => {

        const segmentId = detailedSegmentAttributes.id;

        let segment = newSegmentsById[segmentId];
        segment.totalElevationGain = detailedSegmentAttributes.totalElevationGain;

        segment.mapPolyline = detailedSegmentAttributes.map;
      });

      newState = {
        segmentsById: newSegmentsById
      };
      return newState;
    }
  }

  return state;
}
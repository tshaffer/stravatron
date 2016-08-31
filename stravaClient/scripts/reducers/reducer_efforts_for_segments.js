import { ADD_EFFORTS_FOR_SEGMENT } from '../actions/index';

const initialState =
    {
        effortsForSegmentsBySegmentId: {}
    };

let newEffortsForSegmentsBySegmentId = null;
let newState = null;

// effortsForSegment
export default function(state = initialState, action) {

    console.log("reducer_efforts_for_segments: ", action.type);

    switch (action.type) {

        case ADD_EFFORTS_FOR_SEGMENT: {

            newEffortsForSegmentsBySegmentId = Object.assign( {}, state.effortsForSegmentsBySegmentId);

            const segmentId = action.segmentId;
            const effortsForSegment = action.effortsForSegment;
            newEffortsForSegmentsBySegmentId[segmentId] = effortsForSegment;

            newState = {
                effortsForSegmentsBySegmentId: newEffortsForSegmentsBySegmentId
            };

            return newState;
        }

    }

    return state;
}
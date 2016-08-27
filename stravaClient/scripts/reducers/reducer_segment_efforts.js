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
import { ADD_SEGMENTS } from '../actions/index';

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

    }

    return state;
}
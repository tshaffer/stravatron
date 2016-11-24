import { SET_MAP_STREAM_INDEX } from '../actions/index';

const initialState = -1;

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {

        case SET_MAP_STREAM_INDEX: {
            return action.streamIndex;
        }
    }

    return state;
}

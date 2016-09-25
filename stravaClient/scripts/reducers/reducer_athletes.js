import { SET_ATHLETES } from '../actions/dbActions';

const initialState = [];

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {

        case SET_ATHLETES: {
            newState = Object.assign( [], action.athletes);
            return newState;
        }
    }

    return state;
}

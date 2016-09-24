import { SET_ATHLETES } from '../actions/dbActions';

const initialState =
    {
        athletes: []
    };

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {

        case SET_ATHLETES: {
            newState = {
                athletes: Object.assign( [], action.athletes)
            };
            return newState;
        }
    }

    return state;
}

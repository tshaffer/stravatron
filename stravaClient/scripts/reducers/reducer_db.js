import { SET_DB } from '../actions/dbActions';

const initialState =
    {
        db: {}
    };

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {

        case SET_DB: {
            newState = {
                db: Object.assign( {}, action.db)
            };
            return newState;
        }
    }

    return state;
}
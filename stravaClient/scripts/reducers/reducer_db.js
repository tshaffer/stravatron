import { SET_DB } from '../actions/dbActions';

const initialState =
    {
        dbServices: null,
        dbConnection: null
    };

export default function(state = initialState, action) {

    let newState = null;

    switch (action.type) {

        case SET_DB: {
            newState = {
                dbServices: Object.assign( {}, action.dbServices),
                dbConnection: Object.assign( {}, action.dbConnection)
            };
            return newState;
        }
    }

    return state;
}

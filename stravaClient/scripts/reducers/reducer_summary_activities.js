import { SET_SUMMARY_ACTIVITIES } from '../actions/index';

const initialState =
{
    summaryActivities: []
};


export default function(state = initialState, action) {

    switch (action.type) {
        case SET_SUMMARY_ACTIVITIES:
            // const newState = {
            //     summaryActivites: action.summaryActivities
            // }
            // return newState;
            return action.summaryActivities;
    }

    return state;
}
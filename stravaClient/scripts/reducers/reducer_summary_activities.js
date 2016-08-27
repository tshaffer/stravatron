import { ADD_SUMMARY_ACTIVITIES } from '../actions/index';

const initialState =
    {
        summaryActivitiesById: {}
    };


let newSummaryActivitiesById = null;
let newState = null;

export default function(state = initialState, action) {

    switch (action.type) {

        case ADD_SUMMARY_ACTIVITIES: {
            newSummaryActivitiesById = Object.assign( {}, state.summaryActivitiesById);

            const summaryActivities = action.summaryActivities;
            summaryActivities.forEach( (summaryActivity) => {
                newSummaryActivitiesById[summaryActivity.id] = summaryActivity;
            });

            newState = {
                summaryActivitiesById: newSummaryActivitiesById
            };
            return newState;
        }

    }

    return state;
}
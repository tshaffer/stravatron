import { ADD_ACTIVITIES, SET_ACTIVITIES, ADD_DETAILED_ACTIVITY_ATTRIBUTES, ADD_ACTIVITY_MAP } from '../actions/index';
import Activity from '../entities/activity';

const initialState =
    {
        activitiesById: {}
    };

let newActivitiesById = null;
let newState = null;

export default function(state = initialState, action) {

    switch (action.type) {

        case ADD_ACTIVITIES: {
            newActivitiesById = Object.assign( {}, state.activitiesById);

            const activities = action.activities;
            activities.forEach( (activity) => {
                newActivitiesById[activity.id] = activity;
            });

            newState = {
                activitiesById: newActivitiesById
            };
            return newState;
        }

        case SET_ACTIVITIES: {

            newActivitiesById = {};

            const activities = action.activities;
            activities.forEach( (activity) => {
                newActivitiesById[activity.id] = activity;
            });

            newState = {
                activitiesById: newActivitiesById
            };
            return newState;
        }

        case ADD_ACTIVITY_MAP: {

            newActivitiesById = Object.assign( {}, state.activitiesById);

            const activityId = action.activityId;

            if (activityId in state.activitiesById) {

                let activity = state.activitiesById[activityId];

                const mapPolyline = action.mapPolyline;

                let newActivity = new Activity();
                newActivity = Object.assign(newActivity, activity);

                newActivity.mapPolyline = mapPolyline;
                newActivitiesById[activityId] = newActivity;
            }

            newState = {
                activitiesById: newActivitiesById
            };
            return newState;

        }

        case ADD_DETAILED_ACTIVITY_ATTRIBUTES: {

            newActivitiesById = Object.assign( {}, state.activitiesById);

            const activityId = action.activityId;

            console.log(action.activityId);
            console.log(activityId);

            if (activityId in state.activitiesById) {

                let activity = state.activitiesById[activityId];

                const detailedActivityAttributes = action.detailedActivityAttributes;

                let newActivity = new Activity();
                newActivity = Object.assign(newActivity, activity);

                newActivity.calories = detailedActivityAttributes.calories;
                newActivity.mapPolyline = detailedActivityAttributes.mapPolyline;
                newActivity.streams = detailedActivityAttributes.streams;

                newActivitiesById[activityId] = newActivity;
            }

            newState = {
                activitiesById: newActivitiesById
            };
            return newState;
        }
    }

    return state;
}

// Selectors
export const getActivity = (state, activityId) => {
    return state.activities.activitiesById[activityId];
};

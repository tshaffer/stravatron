import { ADD_ACTIVITIES, ADD_DETAILED_ACTIVITY_ATTRIBUTES } from '../actions/index';
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

        case ADD_DETAILED_ACTIVITY_ATTRIBUTES: {

            newActivitiesById = Object.assign( {}, state.activitiesById);

            const activityId = action.activityId;

            if (activityId in state.activitiesById) {

                let activity = state.activitiesById[activityId];

                const detailedActivityAttributes = action.detailedActivityAttributes;

                let newActivity = new Activity();
                newActivity = Object.assign(newActivity, activity);

                let segmentEffortIds = [];
                detailedActivityAttributes.segmentEfforts.forEach( (segmentEffort) => {
                    segmentEffortIds.push(segmentEffort.id);
                });

                newActivity.segmentEffortIds = segmentEffortIds;
                newActivity.calories = detailedActivityAttributes.calories;
                newActivity.map =
                {
                    id: detailedActivityAttributes.map.id,
                    polyline: detailedActivityAttributes.map.polyline
                };

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
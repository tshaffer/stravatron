import { ADD_SUMMARY_ACTIVITIES, ADD_DETAILED_ACTIVITY_ATTRIBUTES } from '../actions/index';
import SummaryActivity from '../entities/summaryActivity';

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

        case ADD_DETAILED_ACTIVITY_ATTRIBUTES: {

            newSummaryActivitiesById = Object.assign( {}, state.summaryActivitiesById);

            const activityId = action.activityId;

            if (activityId in state.summaryActivitiesById) {

                let activity = state.summaryActivitiesById[activityId];

                const detailedActivityAttributes = action.detailedActivityAttributes;

                let newActivity = new SummaryActivity();
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
                    polyline: detailedActivityAttributes.map.polyline,
                    summaryPolyline: detailedActivityAttributes.map.summary_polyline
                };

                newSummaryActivitiesById[activityId] = newActivity;
            }

            newState = {
                summaryActivitiesById: newSummaryActivitiesById
            };
            return newState;

        }


    }

    return state;
}
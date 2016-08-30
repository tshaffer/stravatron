import { ADD_SEGMENTS, ADD_DETAILED_SEGMENT_ATTRIBUTES } from '../actions/index';

const initialState =
    {
        segmentsById: {}
    };

let newSegmentsById = null;
let newState = null;

export default function(state = initialState, action) {

    switch (action.type) {

        case ADD_SEGMENTS: {
            newSegmentsById = Object.assign( {}, state.segmentsById);

            const segments = action.segments;
            segments.forEach( (segment) => {
                newSegmentsById[segment.id] = segment;
            });

            newState = {
                segmentsById: newSegmentsById
            };
            return newState;
        }

        case ADD_DETAILED_SEGMENT_ATTRIBUTES: {

            action.detailedSegmentsAttributes.forEach( (detailedSegmentAttributes) => {

                const segmentId = detailedSegmentAttributes.id;
                console.log("ADD_DETAILED_SEGMENT_ATTRIBUTES: segmentId is ", segmentId);

            });

            debugger;
            
            // newSegmentsById = Object.assign( {}, state.segmentsById);


            // if (activityId in state.activitiesById) {
            //
            //     let activity = state.activitiesById[activityId];
            //
            //     const detailedActivityAttributes = action.detailedActivityAttributes;
            //
            //     let newActivity = new Activity();
            //     newActivity = Object.assign(newActivity, activity);
            //
            //     let segmentEffortIds = [];
            //     detailedActivityAttributes.segmentEfforts.forEach( (segmentEffort) => {
            //         segmentEffortIds.push(segmentEffort.id);
            //     });
            //
            //     newActivity.segmentEffortIds = segmentEffortIds;
            //     newActivity.calories = detailedActivityAttributes.calories;
            //     newActivity.map =
            //     {
            //         id: detailedActivityAttributes.map.id,
            //         polyline: detailedActivityAttributes.map.polyline,
            //         Polyline: detailedActivityAttributes.map.polyline
            //     };
            //
            //     newActivitiesById[activityId] = newActivity;
            // }

            // newState = {
            //     activitiesById: newActivitiesById
            // };
            // return newState;

            return state;
        }

    }

    return state;
}
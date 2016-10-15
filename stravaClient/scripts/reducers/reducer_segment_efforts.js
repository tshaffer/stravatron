import { ADD_SEGMENT_EFFORTS } from '../actions/index';

const initialState =
    {
        segmentEffortsById: {}
    };

let newSegmentEffortsById = null;
let newState = null;

export default function(state = initialState, action) {

    switch (action.type) {

        case ADD_SEGMENT_EFFORTS: {
            newSegmentEffortsById = Object.assign( {}, state.segmentEffortsById);

            const segmentEfforts = action.segmentEfforts;
            segmentEfforts.forEach( (segmentEffort) => {
                newSegmentEffortsById[segmentEffort.id] = segmentEffort;
            });

            newState = {
                segmentEffortsById: newSegmentEffortsById
            };
            return newState;
        }
    }

    return state;
}

// Selectors

// export const getMediaStatesForZone = createSelector<DmState, BaDmId[], DmMediaStateMap, BaDmId> (
//     getStatesById, getZoneIdProp,
//         (states, zone) => {
//             return Object.keys(states).filter((id, index, idArray): boolean => states[id].container.id === zone);
//         }
// );

export const getSegmentEffortIdsForActivity = (state, activityId) => {

    let segmentEffortIds = [];

    const segmentEfforts = state;
    // const segmentEfforts = state.segmentEfforts;

    for (let segmentEffortId in segmentEfforts.segmentEffortsById) {
        const segmentEffort = segmentEfforts.segmentEffortsById[segmentEffortId];
        if (segmentEffort.activityId == activityId) {
            segmentEffortIds.push(segmentEffortId);
        }
    }

    return segmentEffortIds;
};

export const getSegmentEffortsForActivity = (state, activityId) => {

    let segmentEfforts = [];

    for (let segmentEffortId in state.segmentEfforts.segmentEffortsById) {
        const segmentEffort = state.segmentEfforts.segmentEffortsById[segmentEffortId];
        if (segmentEffort.activityId == activityId) {
            segmentEfforts.push(segmentEffort);
        }
    }

    return segmentEfforts;
};

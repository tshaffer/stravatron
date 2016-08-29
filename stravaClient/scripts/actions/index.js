/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');

import Segment from '../entities/segment';
import SegmentEffort from '../entities/segmentEffort';
import Activity from '../entities/activity';

export const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
export function addActivities(activities) {

    return {
        type: ADD_ACTIVITIES,
        activities
    };
}

export const ADD_DETAILED_ACTIVITY_ATTRIBUTES = 'ADD_DETAILED_ACTIVITY_ATTRIBUTES';
export function addDetailedActivityAttributes(activityId, detailedActivityAttributes) {

    return {
        type: ADD_DETAILED_ACTIVITY_ATTRIBUTES,
        activityId,
        detailedActivityAttributes
    };
}

export const ADD_SEGMENTS = 'ADD_SEGMENTS';
export function addSegments(segments) {

    return {
        type: ADD_SEGMENTS,
        segments
    };
}


export const ADD_SEGMENT_EFFORTS = 'ADD_SEGMENT_EFFORTS';
export function addSegmentEfforts(segmentEfforts) {

    return {
        type: ADD_SEGMENT_EFFORTS,
        segmentEfforts
    };
}

// hardcoded for now
function getAthleteData() {
    
    let athlete = {};
    athlete.id = "2843574";
    athlete.firstName = "Ted";
    athlete.lastName = "Shaffer";
    athlete.email = "shaffer_family@yahoo.com";

    return athlete;
}

function getResponseData() {

    let responseData = {};
    responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";
    responseData.athlete = getAthleteData();

    return responseData;
}


// function fetchStreamFromStrava(responseData, detailedActivityData, detailedActivityIdToFetchFromServer, detailedActivityIdsToFetchFromServer, idsOfActivitiesFetchedFromStrava) {
//
//     var str = "";
//
//     var options = {
//         host: 'www.strava.com',
//         path: '/api/v3/activities/' + detailedActivityIdToFetchFromServer.toString() + '/streams/time,latlng,distance,altitude,grade_smooth',
//         port: 443,
//         headers: {
//             'Authorization': 'Bearer ' + responseData.accessToken
//         }
//     };
//
//     https.get(options, function (streamResponse) {
//         console.log('STATUS: ' + streamResponse.statusCode);
//         console.log('HEADERS: ' + JSON.stringify(streamResponse.headers));
//
//         streamResponse.on('data', function (d) {
//             str += d;
//             console.log("stream chunk received for detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);
//         });
//
//         streamResponse.on('end', function () {
//             console.log("end received for stream fetch of detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);
//
//             idsOfActivitiesFetchedFromStrava.push(detailedActivityIdToFetchFromServer);
//
//             // what is the length of the stream?
//             detailedActivityData.stream = str;
//             console.log("length of stream string is: " + detailedActivityData.stream.length);
//
//             // convert from Strava JSON format into the format digestible by the db
//             var convertedActivity = convertDetailedActivity(detailedActivityData);
//             responseData.detailedActivitiesToReturn.push(convertedActivity);
//
//             // retrieve segment effort ids (and segment id's?) from detailed activity
//             segmentEfforts = detailedActivityData.segment_efforts;
//             console.log("number of segment efforts for this activity is " + segmentEfforts.length);
//
//             segmentEfforts.forEach(addSegmentEffortIdToDB);
//
//             console.log("check for completion");
//             if (idsOfActivitiesFetchedFromStrava.length == Object.keys(detailedActivityIdsToFetchFromServer).length) {
//                 console.log("all detailed activities fetched from strava");
//                 sendActivitiesResponse(responseData.serverResponse, responseData.detailedActivitiesToReturn);
//                 return;
//             }
//         });
//     });
// }

function fetchStravaData(endPoint) {

    console.log("actions/index.js::fetchStravaData from " + endPoint);

    return new Promise(function (resolve, reject) {

        const responseData = getResponseData();

        var options = {
            host: 'www.strava.com',
            path: '/api/v3/' + endPoint,
            port: 443,
            headers: {
                'Authorization': 'Bearer ' + responseData.accessToken
            }
        };

        var str = "";

        https.get(options, function (res) {
            res.on('data', function (d) {
                str += d;
            });
            res.on('end', function () {
                var data = JSON.parse(str);
                console.log("strava data retrieved from " + endPoint);
                resolve(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
            reject(err);
        });
    });
}

export function loadSegment(segmentId) {

    return function(dispatch) {

        console.log("actions/index.js::loadSegment invoked: ", segmentId);

        // fetchStravaData("segments/" + segmentId).then( (stravaDetailedSegment)=> {
        //
        //     debugger;
        //
        //     let segments = [];
        //     let segmentEfforts = [];
        //
        //     stravaDetailedActivity.segment_efforts.forEach( (stravaSegmentEffort) => {
        //
        //         const segment = new Segment(stravaSegmentEffort.segment);
        //         segments.push(segment);
        //
        //         const segmentEffort = new SegmentEffort(stravaSegmentEffort);
        //         segmentEfforts.push(segmentEffort);
        //     });
        //
        //     dispatch(addSegments(segments));
        //     dispatch(addSegmentEfforts(segmentEfforts));
        //
        //     const detailedActivityAttributes =
        //     {
        //         "calories": stravaDetailedActivity.calories,
        //         "segmentEfforts": stravaDetailedActivity.segment_efforts,
        //         "map": stravaDetailedActivity.map
        //     };
        //     dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));
        // });
    };

}

export function loadDetailedActivity(activityId) {

    return function(dispatch) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        fetchStravaData("activities/" + activityId).then( (stravaDetailedActivity)=> {

            let segments = [];
            let segmentIds = [];
            let segmentEfforts = [];

            stravaDetailedActivity.segment_efforts.forEach( (stravaSegmentEffort) => {

                const segment = new Segment(stravaSegmentEffort.segment);
                segments.push(segment);

                segmentIds.push(stravaSegmentEffort.segment.id);

                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                segmentEfforts.push(segmentEffort);
            });

            dispatch(addSegmentEfforts(segmentEfforts));

            // at this point, we have a list of segmentIds for this activity
            // next, fetch all the detailed segments. what is the best way to do that?
            dispatch(addSegments(segments));
            // a few options
            //      invoke loadSegment for each segmentId; get back a promise. do a Promise.all, then perform dispatch on all
            //      invoke loadSegment one at a time; when one finishes, invoke the next one. perform dispatch when they are all complete.
            //      use the segment summary objects, then fill in the detailed data later.

            const detailedActivityAttributes =
                {
                    "calories": stravaDetailedActivity.calories,
                    "segmentEfforts": stravaDetailedActivity.segment_efforts,
                    "map": stravaDetailedActivity.map
                };
            dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));
        });
    };
}

export function loadSummaryActivities() {

    return function(dispatch) {

        console.log("actions/index.js::loadSummaryActivities invoked");

        fetchStravaData("athlete/activities").then( (stravaSummaryActivities)=> {

            let activities = [];

            stravaSummaryActivities.forEach( (stravaActivity) => {
                const summaryActivity = new Activity(stravaActivity);
                activities.push(summaryActivity);
            });

            dispatch(addActivities(activities));
        });
    };
}


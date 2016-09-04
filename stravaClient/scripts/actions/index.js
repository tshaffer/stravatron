/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');

import Segment from '../entities/segment';
import SegmentEffort from '../entities/segmentEffort';
import Activity from '../entities/activity';


export const ADD_EFFORTS_FOR_SEGMENT = 'ADD_EFFORTS_FOR_SEGMENT';
function addEffortsForSegment(segmentId, effortsForSegment) {
    return {
        type: ADD_EFFORTS_FOR_SEGMENT,
        segmentId,
        effortsForSegment
    };
}


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

export const ADD_DETAILED_SEGMENT_ATTRIBUTES = 'ADD_DETAILED_SEGMENT_ATTRIBUTES';
export function addDetailedSegmentAttributes(detailedSegmentsAttributes) {

    return {
        type: ADD_DETAILED_SEGMENT_ATTRIBUTES,
        detailedSegmentsAttributes
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
                resolve(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
            reject(err);
        });
    });
}

function fetchStream(activityId) {

    return new Promise((resolve) => {

        console.log("actions/index.js::fetchStream invoked: ", activityId);

        fetchStravaData('activities/' + activityId + '/streams/time,latlng,distance,altitude,grade_smooth').then( (stravaStreams) => {
            resolve(stravaStreams);
        });
    });
}

function fetchAllEfforts(athleteId, segmentId) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchAllEfforts invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString()).then( (stravaAllEfforts) => {
            resolve(stravaAllEfforts);
        });
    });
}


function fetchSegment(segmentId) {

    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchSegment invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId).then( (stravaDetailedSegment)=> {
            resolve(stravaDetailedSegment);
        });
    });
}


export function loadDetailedActivity(activityId) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        fetchStravaData("activities/" + activityId).then((stravaDetailedActivity)=> {

            // retrieve streams for this activity
            // ** what if all the efforts are retrieved before streams are retrieved? is that a problem?
            fetchStream(activityId).then((stravaStreams) => {
                console.log("streams retrieved");

                // stravaStreams is an array of objects
                // each object has the following data members
                //      data
                //          array of locations
                //      original_size
                //          int
                //      resolution
                //          string = 'high'
                //      series_type
                //          string = 'distance'
                //      type
                //          string = 'latlng'
                const detailedActivityAttributes =
                    {
                        "calories": stravaDetailedActivity.calories,
                        "segmentEfforts": stravaDetailedActivity.segment_efforts,
                        "map": stravaDetailedActivity.map,
                        "streams": stravaStreams
                    };
                dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));

                const s=getState();
            });

            let segments = [];
            let segmentIds = [];
            let segmentEfforts = [];

            stravaDetailedActivity.segment_efforts.forEach((stravaSegmentEffort) => {

                const segment = new Segment(stravaSegmentEffort.segment);
                segments.push(segment);

                segmentIds.push(stravaSegmentEffort.segment.id);

                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                segmentEfforts.push(segmentEffort);
            });

            dispatch(addSegmentEfforts(segmentEfforts));

            dispatch(addSegments(segments));

            // retrieve all efforts for each of the segments in this activity
            let fetchAllEffortsPromises = [];
            const athleteId = "2843574";
            segmentIds.forEach((segmentId) => {
                fetchAllEffortsPromises.push(fetchAllEfforts(athleteId, segmentId));
            });

            let allEffortsList = [];

            Promise.all(fetchAllEffortsPromises).then(allEffortsForSegmentsInCurrentActivity => {

                if (allEffortsForSegmentsInCurrentActivity instanceof Array) {

                    allEffortsForSegmentsInCurrentActivity.forEach(allEffortsForSegment => {
                        if (allEffortsForSegment instanceof Array) {

                            // get information about segment as appropriate, presumably from first 'effort for segment'

                            // convert to stravatron segmentEfforts
                            segmentEfforts = [];
                            allEffortsForSegment.forEach((stravaSegmentEffort) => {
                                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                                segmentEfforts.push(segmentEffort);

                            });

                            // add all individual segment efforts to store
                            let beforeState = getState();
                            dispatch(addSegmentEfforts(segmentEfforts));
                            let afterState = getState();

                            // add all efforts for this segment to store
                            if (segmentEfforts.length > 0) {
                                dispatch(addEffortsForSegment(segmentEfforts[0].segmentId, segmentEfforts));
                            }
                            afterState = getState();
                        }
                    });
                }
            });

            let fetchSegmentPromises = [];
            segmentIds.forEach((segmentId) => {
                fetchSegmentPromises.push(fetchSegment(segmentId));
            });

            let detailedSegmentsAttributes = [];

            Promise.all(fetchSegmentPromises).then(segments => {

                segments.forEach(segment => {
                    detailedSegmentsAttributes.push(
                        {
                            "id": segment.id,
                            "createdAt": segment.created_at,
                            "totalElevationGain": segment.total_elevation_gain,
                            "map": segment.map,
                            "effortCount": segment.effort_count
                        }
                    );
                });

                dispatch(addDetailedSegmentAttributes(detailedSegmentsAttributes));
            });
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


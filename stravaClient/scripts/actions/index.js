/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');
const fs = require('fs');

import * as Converters from '../utilities/converters';

import Segment from '../entities/segment';
import SegmentEffort from '../entities/segmentEffort';
import Activity from '../entities/activity';

export const SET_SELECTED_ATHLETE = 'SET_SELECTED_ATHLETE';
export const CLEAR_ACTIVITIES = 'CLEAR_ACTIVITIES';
export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
export const SET_ACTIVITIES = 'SET_ACTIVITIES';
export const ADD_ACTIVITY_MAP = 'ADD_ACTIVITY_MAP';
export const ADD_DETAILED_ACTIVITY_ATTRIBUTES = 'ADD_DETAILED_ACTIVITY_ATTRIBUTES';
export const ADD_SEGMENTS = 'ADD_SEGMENTS';
export const ADD_DETAILED_SEGMENT_ATTRIBUTES = 'ADD_DETAILED_SEGMENT_ATTRIBUTES';
export const ADD_SEGMENT_EFFORTS = 'ADD_SEGMENT_EFFORTS';
export const SET_CUSTOM_MAP_SEGMENTS = 'SET_CUSTOM_MAP_SEGMENTS';
export const SET_BASE_MAP_SEGMENTS = 'SET_BASE_MAP_SEGMENTS';
export const SET_SEGMENT_END_POINT = 'SET_SEGMENT_END_POINT';
export const SET_ACTIVITY_LOCATIONS = 'SET_ACTIVITY_LOCATIONS';
export const SET_COORDINATES = 'SET_COORDINATES';
export const TOGGLE_REPORT_CLICK_LOCATION = 'TOGGLE_REPORT_CLICK_LOCATION';

export function setSelectedAthlete(athlete) {
  return {
    type: SET_SELECTED_ATHLETE,
    athlete
  };
}

export function clearActivities() {

  return {
    type: CLEAR_ACTIVITIES
  };
}

export function addActivity(activity) {

  return {
    type: ADD_ACTIVITY,
    activity
  };
}


export function addActivities(activities) {

  return {
    type: ADD_ACTIVITIES,
    activities
  };
}

export function setActivities(activities) {

  return {
    type: SET_ACTIVITIES,
    activities
  };
}

export function addActivityMap(activityId, mapPolyline) {

  return {
    type: ADD_ACTIVITY_MAP,
    activityId,
    mapPolyline
  };
}


export function addDetailedActivityAttributes(activityId, detailedActivityAttributes) {

  return {
    type: ADD_DETAILED_ACTIVITY_ATTRIBUTES,
    activityId,
    detailedActivityAttributes
  };
}

// export function setSegmentEndPoint(latitudeLongitude) {
//
//   return {
//     type: SET_SEGMENT_END_POINT,
//     latitudeLongitude
//   };
// }
//
export function setActivityLocations(activityLocations) {

  return {
    type: SET_ACTIVITY_LOCATIONS,
    payload: activityLocations
  };
}

export function addSegments(segments) {

  return {
    type: ADD_SEGMENTS,
    segments
  };
}

export function addDetailedSegmentAttributes(detailedSegmentsAttributes) {

  return {
    type: ADD_DETAILED_SEGMENT_ATTRIBUTES,
    detailedSegmentsAttributes
  };
}


export function addSegmentEfforts(segmentEfforts) {

  return {
    type: ADD_SEGMENT_EFFORTS,
    segmentEfforts
  };
}

function getAthleteData(state = null) {

  let athleteData = {};

  if (state) {
    const athlete = state.selectedAthlete;
    if (athlete) {
      athleteData.athlete = {};
      athleteData.athlete.id = athlete.stravaAthleteId;
      athleteData.athlete.firstname = athlete.firstname;
      athleteData.athlete.lastname = athlete.lastname;
      athleteData.athlete.email = athlete.email;
      athleteData.accessToken = athlete.accessToken;
      return athleteData;
    }
  }

  return null;
}

function fetchStravaData(endPoint, state) {

  return new Promise(function (resolve, reject) {

    const athleteData = getAthleteData(state);

    let options = {
      host: 'www.strava.com',
      path: '/api/v3/' + endPoint,
      port: 443,
      headers: {
        'Authorization': 'Bearer ' + athleteData.accessToken
      }
    };

    let str = "";

    https.get(options, function (res) {
      res.on('data', function (d) {
        str += d;
      });
      res.on('end', function () {
        let data = JSON.parse(str);
        resolve(data);
      });

    }).on('error', function (err) {
      console.log('Caught exception: ' + err);
      reject(err);
    });
  });
}

function fetchStream(activityId, getState) {

  return new Promise((resolve) => {

    fetchStravaData('activities/' + activityId +
      '/streams/time,latlng,distance,altitude,grade_smooth',
      getState()).then( (stravaStreams) => {
        resolve(stravaStreams);
      });
  });
}

function fetchAllEfforts(athleteId, segmentId, getState) {
  // return new Promise((resolve, reject) => {
  return new Promise((resolve) => {

    fetchStravaData("segments/" + segmentId.toString() + '/all_efforts?athlete_id=' +
      athleteId.toString(), getState()).then( (stravaAllEfforts) => {
        resolve(stravaAllEfforts);
      });
  });
}

function fetchSegment(segmentId, getState) {

  // return new Promise((resolve, reject) => {
  return new Promise((resolve) => {

    fetchStravaData("segments/" + segmentId, getState()).then( (stravaDetailedSegment)=> {
      resolve(stravaDetailedSegment);
    });
  });
}

export function loadActivityMap(activityId) {

  return function(dispatch, getState) {

    return fetchStravaData("activities/" + activityId, getState()).then((stravaDetailedActivity)=> {
      dispatch(addActivityMap(stravaDetailedActivity.id, stravaDetailedActivity.map.polyline));
    });
  };
}

function loadDetailedActivityFromDB(activityId, activity, dbServices, dispatch) {

  // retrieve segments for this activity
  const getSegmentsForActivityPromise = dbServices.getSegmentsForActivity(activityId);
  getSegmentsForActivityPromise.then( (segmentsForActivity) => {
    dispatch(addSegments(segmentsForActivity));
  });

  const getSegmentEffortsForActivityPromise = dbServices.getSegmentEffortsForActivity(activityId);
  getSegmentEffortsForActivityPromise.then( (segmentsEffortsForActivity) => {
    dispatch(addSegmentEfforts(segmentsEffortsForActivity));

    // iterate through segmentEffortsForActivity to generate segmentEffortsBySegment
    // if (segmentEfforts.length > 0) {
    //     dispatch(addEffortsForSegment(segmentEfforts[0].segmentId, segmentEfforts));
    // }
    let segmentEffortsBySegment = {};
    let segmentEffortsForCurrentActivity = [];

    segmentsEffortsForActivity.forEach( (segmentEffortForActivity) => {
      const segmentId = segmentEffortForActivity.segmentId;
      const segmentEffort = segmentEffortForActivity;

      // capture segmentEfforts this selected activity
      if (segmentEffort.activityId === activityId) {
        segmentEffortsForCurrentActivity.push(segmentEffort);
      }

      if (!(segmentId in segmentEffortsBySegment)) {
        segmentEffortsBySegment[segmentId] = [segmentEffort];
      }
      else {
        let segmentEfforts = segmentEffortsBySegment[segmentId];
        segmentEfforts.push(segmentEffort);
      }
    });

    const getStreamsPromise = dbServices.getStream(activityId);
    getStreamsPromise.then( (streamData) => {

      let streams = getStreamsFromStreamData(streamData);
      dispatch(setActivityLocations(streamData.locationData));

      const detailedActivityAttributes =
        {
          "calories": 0,
          "segmentEfforts": segmentEffortsForCurrentActivity,
          "mapPolyline": activity.mapPolyline,
          "streams": streams
        };
      dispatch(addDetailedActivityAttributes(activityId, detailedActivityAttributes));
    });
  });
}

function getStreamsFromStreamData(streamData) {
  let streams = [];

  let stream = {};
  stream.type = "time";
  stream.data = streamData.timeData;
  streams.push(stream);

  stream = {};
  stream.type = "distance";
  stream.data = streamData.distanceData;
  streams.push(stream);

  stream = {};
  stream.type = "altitude";
  stream.data = streamData.elevationData;
  streams.push(stream);

  stream = {};
  stream.type = "latlng";
  stream.data = streamData.locationData;
  streams.push(stream);

  stream = {};
  stream.type = "grade_smooth";
  stream.data = streamData.gradientData;
  streams.push(stream);

  return streams;
}

function loadDetailedActivityFromStrava(activityId, _, dbServices, dispatch, getState) {

  fetchStravaData("activities/" + activityId, getState()).then((stravaDetailedActivity)=> {

    // retrieve streams for this activity
    // ** what if all the efforts are retrieved before streams are retrieved? is that a problem?
    fetchStream(activityId, getState).then((stravaStreams) => {

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
          "mapPolyline": stravaDetailedActivity.map.polyline,
          "streams": stravaStreams
        };

      // add to store
      dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));

      // add activity details to the db
      dbServices.addDetailsToActivity(stravaDetailedActivity.id, detailedActivityAttributes);

      // add streams to the db
      let timeData = null;
      let locationData = null;
      let elevationData = null;
      let distanceData = null;
      let gradientData = null;
      for (let i = 0; i < stravaStreams.length; i++) {
        switch (stravaStreams[i].type) {
          case 'time':
            timeData = stravaStreams[i].data;
            break;
          case 'distance':
            distanceData = stravaStreams[i].data;
            break;
          case 'altitude':
            elevationData = stravaStreams[i].data;
            break;
          case 'latlng':
            locationData = stravaStreams[i].data;
            break;
          case "grade_smooth":
            gradientData = stravaStreams[i].data;
            break;
        }
      }
      const streamData =
        {
          timeData,
          locationData,
          elevationData,
          distanceData,
          gradientData
        };
      dbServices.addStream(stravaDetailedActivity.id, streamData);
      dispatch(setActivityLocations(locationData));
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

      // add segment, segmentEffort to db
      const addSegmentPromise = dbServices.addSegment(segment);
      addSegmentPromise.then( () => {
      }, (_) => {
        // console.log("segment addition failed:", activityId);
      });

      const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
      addSegmentEffortPromise.then( () => {
      }, (_) => {
        // console.log("segmentEffort addition failed:", segmentEffort.activityId);
      });
    });

    dispatch(addSegmentEfforts(segmentEfforts));

    dispatch(addSegments(segments));

    // retrieve all efforts for each of the segments in this activity
    let fetchAllEffortsPromises = [];
    const athleteId = "2843574";            // pa
    // const athleteId = "7085811";         // ma
    segmentIds.forEach((segmentId) => {
      fetchAllEffortsPromises.push(fetchAllEfforts(athleteId, segmentId, getState));
    });

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

              // add segment effort to the db
              const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
              addSegmentEffortPromise.then( () => {
              }, (_) => {
                // console.log("segmentEffort addition failed:", segmentEffort.activityId);
              });
            });

            // add all individual segment efforts to store
            dispatch(addSegmentEfforts(segmentEfforts));
          }
        });
      }
    });

    let fetchSegmentPromises = [];
    segmentIds.forEach((segmentId) => {
      fetchSegmentPromises.push(fetchSegment(segmentId, getState));
    });

    let detailedSegmentsAttributes = [];

    Promise.all(fetchSegmentPromises).then(segments => {

      segments.forEach(segment => {

        const detailedSegmentAttributes =
          {
            "id": segment.id,
            "totalElevationGain": segment.total_elevation_gain,
            "map": segment.map,
          };
        detailedSegmentsAttributes.push(detailedSegmentAttributes);

        dbServices.addDetailsToSegment(segment.id, detailedSegmentAttributes);
      });

      dispatch(addDetailedSegmentAttributes(detailedSegmentsAttributes));
    });
  });
}

export function loadDetailedActivity(activityId) {

  return function(dispatch, getState) {

    let state = getState();
    const dbServices = state.db.dbServices;

    let activity = getState().activities.activitiesById[activityId];

    // check to see if detailed data exists for activity - if not, fetch it.
    // I think the following is kind of a hack - how about if (activity.detailsExist())
    if (activity.mapPolyline && activity.mapPolyline !== "") {
      loadDetailedActivityFromDB(activityId, activity, dbServices, dispatch, getState);
    }
    else {
      loadDetailedActivityFromStrava(activityId, activity, dbServices, dispatch, getState);
    }
  };
}

export function fetchAndUpdateSummaryActivities() {

  return function(dispatch, getState) {

    let state = getState();
    const dbServices = state.db.dbServices;

    // get summaryActivities from db for current athlete
    const athleteData = getAthleteData(state);
    const athleteId = athleteData.athlete.id;

    dbServices.getActivities(athleteId).then( (dbActivities) => {

      const activityData = parseDbSummaryActivities(dbActivities);
      const activities = activityData.activities;
      const latestDate = activityData.latestDate;

      // initialize redux store with these activities
      dispatch(addActivities(activities));

      fetchStravaActivities(latestDate, dbServices, dispatch, getState);
    });
  };
}

function fetchStravaActivities(dateOfLastFetchedActivity, dbServices, dispatch, getState) {

  // for afterDate, strava only seems to look at the date; that is, it doesn't look at the time
  // therefore, jump to the next day - the result is that it's possible to lose an activity that occurs on
  // the same date if the activities happen to fall on a page boundary
  const afterDate = new Date(dateOfLastFetchedActivity);
  afterDate.setDate(afterDate.getDate() + 1); // given how strava treats 'afterDate', the following shouldn't make any difference, but ....
  afterDate.setHours(0);
  afterDate.setMinutes(0);
  afterDate.setSeconds(0);
  afterDate.setMilliseconds(0);

  let secondsSinceEpochOfLastActivity = Math.floor(afterDate.getTime() / 1000);
  if (secondsSinceEpochOfLastActivity < 0) {
    secondsSinceEpochOfLastActivity = 0;
  }
  let stravaActivities = [];
  let addActivitiesPromises = [];

  fetchSummaryActivities(secondsSinceEpochOfLastActivity, getState).then((activitiesFromStrava)=> {

    // track latestDate of those retrieved in case additional requests are required
    let latestDate = new Date(1970, 0, 0, 0, 0, 0, 0);

    activitiesFromStrava.forEach((stravaActivity) => {
      stravaActivities.push(stravaActivity);
      addActivitiesPromises.push(dbServices.addActivity(stravaActivity));

      const activityDate = new Date(stravaActivity.startDateLocal);
      if (activityDate.getTime() > latestDate.getTime()) {
        latestDate = activityDate;
      }
    });

    // add activities to the store
    dispatch(addActivities(stravaActivities));

    Promise.all(addActivitiesPromises).then(() => {
      console.log("all new activities added to the db");
      // don't think I need to wait to get here, but I'll do it anyway
      if (stravaActivities.length > 0) {
        fetchStravaActivities(latestDate, dbServices, dispatch, getState);
      }
    },reason => {
      console.log(reason);
      if (reason.toString().startsWith("Error: ER_DUP_ENTRY")) {
        if (stravaActivities.length > 0) {
          fetchStravaActivities(latestDate, dbServices, dispatch, getState);
        }
      }
    });
  });
}


function parseDbSummaryActivities(dbActivities) {

  let activityData = {};

  let activities = [];
  let latestDate = new Date(1970, 0, 0, 0, 0, 0, 0);
  dbActivities.forEach( (dbActivity) => {
    let activity = Object.assign(new Activity(), dbActivity);
    activity.startLatitudeLongitude = [dbActivity.startLatitude, dbActivity.startLongitude];
    activity.endLatitudeLongitude = [dbActivity.endLatitude, dbActivity.endLongitude];
    activities.push(activity);

    // get the timestamp of the most recent activity in the database (just fetched activities)
    if (activity.startDateLocal.getTime() > latestDate.getTime()) {
      latestDate = activity.startDateLocal;
    }
  });

  activityData.activities = activities;
  activityData.latestDate = latestDate;

  return activityData;
}


function parseStravaSummaryActivities(stravaSummaryActivities) {

  let activities = [];

  if (!(stravaSummaryActivities instanceof Array)) {
    debugger;
    console.log("stravaSummaryActivities not array");
    // reject("error");
    return;
  }

  stravaSummaryActivities.forEach( (stravaActivity) => {
    const summaryActivity = new Activity(stravaActivity);

    if (!summaryActivity.description) {
      summaryActivity.description = "";
    }
    if (!summaryActivity.kilojoules) {
      summaryActivity.kilojoules = 0;
    }
    if (!summaryActivity.city) {
      summaryActivity.city = "";
    }
    activities.push(summaryActivity);
  });

  return activities;
}

function fetchSummaryActivities(secondsSinceEpochOfLastActivity, getState) {


  return new Promise((resolve) => {

    const path = "athlete/activities?after=" + secondsSinceEpochOfLastActivity;

    fetchStravaData(path, getState()).then( (stravaSummaryActivities)=> {

      let activities = parseStravaSummaryActivities(stravaSummaryActivities);
      resolve(activities);
    });
  });
}

export function fetchSegmentsActivities(segmentId) {

  return function(dispatch, getState) {

    const state = getState();
    const dbServices = state.db.dbServices;

    dbServices.getActivitiesWithSegment(segmentId).then( (stravaSummaryActivities) => {
      const activityData = parseDbSummaryActivities(stravaSummaryActivities);
      dispatch(setActivities(activityData.activities));
    });
  };
}

export function fetchActivitiesNearLocation(targetRegion) {

  return function(dispatch, getState) {

    const { location, distance } = targetRegion;

    const state = getState();

    // clear old activities
    dispatch(clearActivities());

    for (let activityId in state.activities.activitiesById) {
      if (state.activities.activitiesById.hasOwnProperty(activityId)) {
        const activity = state.activities.activitiesById[activityId];
        getMinimumDistanceToTargetLocation(activity, location, distance, state).then( (minDistanceFromTarget) => {
          if (minDistanceFromTarget < distance) {
            // add each activity as it's found
            dispatch(addActivity(activity));
          }
        },
        (reason) => {
          console.log("getMinimumDistanceToTargetLocation failed: ", reason);
        });
      }
    }
  };
}

function getMinimumDistanceToTargetLocation(activity, location, distance, state) {

  return new Promise((resolve, reject) => {

    if (!(activity.streams && activity.streams.length > 0)) {
      let getStreamsPromise = state.db.dbServices.getStream(activity.id);
      getStreamsPromise.then((streamData) => {
        let streams = getStreamsFromStreamData(streamData);
        let minDistanceFromTarget = getMinimumDistanceFromStream(streams, location, distance);
        resolve(minDistanceFromTarget);
      },
      () => {
        reject("getStream failed: " + activity.name + ", ", activity.id);
      });
    }
    else {
      let minDistanceFromTarget = getMinimumDistanceFromStream(activity.streams, location);
      resolve(minDistanceFromTarget);
    }
  });
}

function getMinimumDistanceFromStream(streams, location, targetDistance) {

  let minDistanceFromTarget = Number.MAX_VALUE;
  let maxDistance = 5280 * 10; // 10 miles

  for (let stream of streams) {
    if (stream.type === "latlng") {
      for (let streamLocation of stream.data) {
        const stravatronLocation = Converters.stravatronCoordinateFromLatLng(streamLocation[0], streamLocation[1]);
        const distanceFromTarget = distanceBetweenPoints(
          stravatronLocation[0],
          stravatronLocation[1],
          location[0],
          location[1],
          "K");

        minDistanceFromTarget = Math.min(minDistanceFromTarget, distanceFromTarget);

        if (minDistanceFromTarget < targetDistance || minDistanceFromTarget > maxDistance) {
          break;
        }
      }
      if (minDistanceFromTarget < targetDistance || minDistanceFromTarget > maxDistance) {
        break;
      }
    }
  }

  return minDistanceFromTarget;
}

function distanceBetweenPoints(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = Math.PI * lat1 / 180;
  let radlat2 = Math.PI * lat2 / 180;
  let theta = lon1 - lon2;
  let radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === "K") { dist = dist * 1.609344; }
  if (unit === "N") { dist = dist * 0.8684; }

  return Converters.kilometersToFeet(dist);
  // return dist;
}
export function SetCustomMapSegments(customMapSegments) {

  return {
    type: SET_CUSTOM_MAP_SEGMENTS,
    customMapSegments
  };
}


export function retrieveCustomSegmentData() {

  return function(dispatch) {
    fs.readFile('segments.json', (_, data) => {

      // check err and do something with it.

      const customSegmentsData = JSON.parse(data);
      dispatch(SetCustomMapSegments(customSegmentsData));
    });
  };
}

export function SetBaseMapSegments(baseMapSegments) {

  return {
    type: SET_BASE_MAP_SEGMENTS,
    baseMapSegments
  };
}

export function retrieveBaseMapSegments() {

  let baseMapSegmentIds = [];
  let baseMapSegments = [];

  return function (dispatch, getState) {

    fetchStravaData("segments/starred", getState()).then((starredSegments) => {

      if (!(starredSegments instanceof Array)) {
        console.log("starredSegments not array");
        return;
      }

      // retrieve the starred segments for the chosen locale
      starredSegments.forEach((segment) => {
        // console.log(segment.name + " in " + segment.city);

        // only retrieve segment id's for the appropriate cities
        if (segment.city === "Santa Cruz" || segment.city === "Felton") {
          // console.log("relevant segment ", segment.name, " has id: " + segment.id);
          baseMapSegmentIds.push(segment.id);
        }
        // else {
        //     console.log("reject segment ", segment.name);
        // }
      });

      // get the detailed segment data for each of the starred segments
      let fetchSegmentPromises = [];
      baseMapSegmentIds.forEach((segmentId) => {
        fetchSegmentPromises.push(fetchSegment(segmentId, getState));
      });

      // wait until all data has been received
      Promise.all(fetchSegmentPromises).then(baseSegments => {

        baseSegments.forEach((baseSegment) => {
          let baseMapSegment = {
            id: baseSegment.id,
            name: baseSegment.name,
            polyline: baseSegment.map.polyline,
            startLatitude: baseSegment.start_latitude,
            startLongitude: baseSegment.start_longitude
          };
          baseMapSegments.push(baseMapSegment);
        });

        // add to redux
        dispatch(SetBaseMapSegments(baseMapSegments));
      });
    });
  };
}

export function setLocationCoordinates(uiElement, index, coordinates) {

  return {
    type: SET_COORDINATES,
    payload: {
      uiElement,
      index,
      coordinates
    }
  };
}

// export function toggleReportClickLocation() {
//   return {
//     type: TOGGLE_REPORT_CLICK_LOCATION,
//   };
// }
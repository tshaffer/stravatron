import React, { Component } from 'react';

import { hashHistory } from 'react-router';

import * as Converters from '../utilities/converters';

class SummaryActivities extends Component {

    showDetails(activityId) {
        console.log("showDetails() invoked for activityId ", activityId);

        // let photoSpec = photo.url.split("/").join("^");
        // photoSpec += "|" + "O=" + photo.orientation.toString();

        hashHistory.push('/detailedActivity/' + activityId);

    }

    buildSummaryActivityRow(activity) {

        var self = this;

        return (
            <tr key={activity.id}>
                <td>
                    <input type='checkbox' id={activity.id} ref={(c) => { this[activity.id] = c; }}/>
                </td>
                <td>
                    {Converters.getDateTime(activity.startDateLocal)}
                </td>
                <td>
                    {activity.name}
                </td>
                <td>
                    {Converters.getMovingTime(activity.movingTime)}
                </td>
                <td>
                    {Converters.metersToMiles(activity.distance).toFixed(1)} mi
                </td>
                <td>
                    {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
                </td>
                <td>
                    {Converters.metersPerSecondToMilesPerHour(activity.averageSpeed).toFixed(1)} mph
                </td>
                <td>
                    {activity.kilojoules.toFixed(0)}
                </td>
                <td>
                    <button onClick={() => self.showDetails(activity.id)}>Show details</button>
                </td>
            </tr>
        );
    }

    buildSummaryActivityRows() {

        var self = this;

        let activities = [];

        const activitiesLUT = this.props.activities.activitiesById;
        for (const key in activitiesLUT) {
            if (activitiesLUT.hasOwnProperty(key)) {
                activities.push(activitiesLUT[key]);
            }
        }
        
        // sort by start_date
        activities.sort( (a, b) => {

            const asd = a.startDate;
            const bsd = b.startDate;

            if (asd > bsd) {
                return -1;
            }
            if (asd < bsd) {
                return 1;
            }
            return 0;
        });

        let summaryActivityRows = activities.map(function(activity) {
            const summaryActivityRow = self.buildSummaryActivityRow(activity);
            return summaryActivityRow;
        });
        return summaryActivityRows;

    }

    mapStarredSegments() {

        console.log("mapStarredSegments invoked");

        hashHistory.push('/mapStarredSegments');

    }

    mapSelectedRides() {
        console.log("mapSelectedRides invoked");

        let selectedActivityIds = [];

        for (const activityId in this.props.activities.activitiesById) {
            if (this.props.activities.activitiesById.hasOwnProperty(activityId)) {
                if (document.getElementById(activityId).checked) {
                    selectedActivityIds.push(activityId);
                }
            }
        }

        if (selectedActivityIds.length === 0) return;

        hashHistory.push('/mapOfRides/' + selectedActivityIds);
    }

    render() {

        const summaryActivityRows = this.buildSummaryActivityRows();

        return (
            <div id="SummaryActivities">
                <button type="button" id="btnMapStarredSegments" onClick={() => this.mapStarredSegments()}>Map of starred segments</button>
                <button type="button" id="btnMapSelectedRides" onClick={() => this.mapSelectedRides()}>Map selected rides</button>
                <button type="button" id="btnCompareSelectedRides">Compare selected rides</button>
                <table id="activitiesTable">
                    <thead>
                        <tr>
                            <th/>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Riding Time</th>
                            <th>Distance</th>
                            <th>Elevation</th>
                            <th>Average Speed</th>
                            <th>Calories</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryActivityRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

SummaryActivities.propTypes = {
    activities: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired
};

export default SummaryActivities;

import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class SummaryActivities extends Component {

    showDetails(activityId) {
        console.log("showDetails() invoked for activityId ", activityId);
        this.props.loadDetailedActivity(activityId);
    }

    buildSummaryActivityRow(activity) {

        var self = this;

        return (
            <tr key={activity.id}>
                <td>
                    <input type='checkbox'/>
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

        let summaryActivityRows = activities.map(function(activity) {
            const summaryActivityRow = self.buildSummaryActivityRow(activity);
            return summaryActivityRow;
        });
        return summaryActivityRows;

    }

    render() {

        const summaryActivityRows = this.buildSummaryActivityRows();

        return (
            <div id="SummaryActivities">
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

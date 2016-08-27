import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class SummaryActivities extends Component {

    showDetails(activityId) {
        console.log("showDetails() invoked for activityId ", activityId);
        this.props.loadDetailedActivity(activityId);
    }

    buildSummaryActivityRow(summaryActivity) {

        var self = this;

        return (
            <tr key={summaryActivity.id}>
                <td>
                    <input type='checkbox'/>
                </td>
                <td>
                    {Converters.getDateTime(summaryActivity.startDateLocal)}
                </td>
                <td>
                    {summaryActivity.name}
                </td>
                <td>
                    {Converters.getMovingTime(summaryActivity.movingTime)}
                </td>
                <td>
                    {Converters.metersToMiles(summaryActivity.distance).toFixed(1)} mi
                </td>
                <td>
                    {Converters.metersToFeet(summaryActivity.totalElevationGain).toFixed(0)} ft
                </td>
                <td>
                    {Converters.metersPerSecondToMilesPerHour(summaryActivity.averageSpeed).toFixed(1)} mph
                </td>
                <td>
                    {summaryActivity.kilojoules.toFixed(0)}
                </td>
                <td>
                    <button onClick={() => self.showDetails(summaryActivity.id)}>Show details</button>
                </td>
            </tr>
        );
    }

    buildSummaryActivityRows() {

        var self = this;

        let summaryActivities = [];

        const activitiesLUT = this.props.summaryActivities.summaryActivitiesById;
        for (const key in activitiesLUT) {
            if (activitiesLUT.hasOwnProperty(key)) {
                summaryActivities.push(activitiesLUT[key]);
            }
        }

        let summaryActivityRows = summaryActivities.map(function(summaryActivity) {
            const summaryActivityRow = self.buildSummaryActivityRow(summaryActivity);
            return summaryActivityRow;
        });
        return summaryActivityRows;

    }

    // number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
    render() {

        const summaryActivityRows = this.buildSummaryActivityRows();

        // number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
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
    summaryActivities: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired

    // activeBSEventType: React.PropTypes.string.isRequired,
    // propertySheetOpen: React.PropTypes.bool.isRequired,
    // onSelectTimeoutEvent: React.PropTypes.func.isRequired,
    // onSelectMediaEndEvent: React.PropTypes.func.isRequired,
    // onToggleOpenClosePropertySheet: React.PropTypes.func.isRequired
};

export default SummaryActivities;

import React, { Component } from 'react';

class SummaryActivities extends Component {

    // number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
    render() {

        return (
            <div>
                number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
            </div>
        );
    }
}

SummaryActivities.propTypes = {
    summaryActivities: React.PropTypes.object.isRequired

    // activeBSEventType: React.PropTypes.string.isRequired,
    // propertySheetOpen: React.PropTypes.bool.isRequired,
    // onSelectTimeoutEvent: React.PropTypes.func.isRequired,
    // onSelectMediaEndEvent: React.PropTypes.func.isRequired,
    // onToggleOpenClosePropertySheet: React.PropTypes.func.isRequired
};

export default SummaryActivities;
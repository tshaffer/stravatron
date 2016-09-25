import React, { Component } from 'react';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

class Landing extends Component {

    handleUpdateSelectedAthlete(event) {

        if (event != undefined) {
            const selectedAthleteName = event.target.value;
            console.log("selected athlete in landing:", selectedAthleteName);
            this.props.onUpdateSelectedAthlete(selectedAthleteName);
        }
    }

    render() {

        const self = this;

        console.log("number of athletes is:", this.props.athletes.length);

        if (this.props.athletes.length > 0) {

            let selectOptions = this.props.athletes.map( (athlete) => {
                return (
                    <option value={athlete.name} key={athlete.stravaAthleteId}>{athlete.name}</option>
                );
            });

            const athlete = this.props.athletes[0];

            let athletesDropDown =
                (<div>
                    Select athlete:
                    <select value={athlete.name} onChange={this.handleUpdateSelectedAthlete.bind(this)}>{selectOptions}</select>
                </div>);

            return athletesDropDown;

        }
        else {
            return <div>Loading...</div>;
        }
    }

}

Landing.propTypes = {
    athletes: React.PropTypes.array.isRequired,
    onUpdateSelectedAthlete: React.PropTypes.func.isRequired
};

export default Landing;

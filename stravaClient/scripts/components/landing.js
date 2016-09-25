/**
 * Created by tedshaffer on 9/24/16.
 */
import React, { Component } from 'react';

class Landing extends Component {

    handleUpdateAthlete() {
        console.log("update athlete in landing");
        this.props.onUpdateAthlete();
    }

    //
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
                    <select value={athlete.name} onChange={this.handleUpdateAthlete.bind(this)}>{selectOptions}</select>
                </div>);

            return athletesDropDown;

        }
        else {
            return <div>Pizza</div>;
        }
    }

}

Landing.propTypes = {
    athletes: React.PropTypes.array.isRequired,
    onUpdateAthlete: React.PropTypes.func.isRequired
};

export default Landing;

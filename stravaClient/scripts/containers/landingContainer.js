import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MysqlServices from '../services/mysqlServices';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';
import Landing from '../components/landing';

import { setDB, loadAthletes, loadMaps } from '../actions/dbActions';

class LandingContainer extends Component {

    constructor(props) {
        super(props);
        this.mysql = new MysqlServices();
    }

    componentWillMount() {
        var self = this;
        const promise = this.mysql.initialize();
        promise.then( db => {
            self.props.setDB(db);
            self.props.loadAthletes(self.mysql);
        }, (err) => {
            console.log("initialization failure:", err);
        });
    }

    handleUpdateAthlete() {
        console.log("update athlete");
    }

    render() {

        // const self = this;
        //
        // console.log("number of athletes is:", this.props.athletes.length);
        //
        // if (this.props.athletes.length > 0) {
        //
        //     let selectOptions = this.props.athletes.map( (athlete) => {
        //         return (
        //             <option value={athlete.name} key={athlete.stravaAthleteId}>{athlete.name}</option>
        //         );
        //     });
        //
        //     const athlete = this.props.athletes[0];
        //
        //     let athletesDropDown =
        //         (<div>
        //             Select athlete:
        //             <select value={athlete.name} onChange={this.handleUpdateAthlete.bind(this)}>{selectOptions}</select>
        //         </div>);
        //
        //     return athletesDropDown;
        //
        // }
        // else {
        //     return <div>Pizza</div>;
        // }

        return (
            <div>
                <Landing
                    athletes={this.props.athletes}
                    onUpdateAthlete={this.handleUpdateAthlete.bind(this)}

                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        db: state.db,
        athletes: state.athletes
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setDB, loadAthletes, loadMaps},
        dispatch);
}

LandingContainer.propTypes = {
    db: React.PropTypes.object.isRequired,
    athletes: React.PropTypes.array.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

import * as Mongo from '../services/mongoController';

export default class App extends Component {

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        // load visualization package for later use
        window.google.load("visualization", "1", { packages: ["corechart"] });

        console.log("connect to mongo");
        Mongo.initialize.then( response => {
            console.log("successfully connected to mongo");
            Mongo.fetchAthletes.then( athletes => {
                console.log("successfully retrieved athletes");
            },
            function(err) {
                console.log("failed to retrieve athletes");
            });
        },
        function(err) {
            console.log("failed to connect to mongo");
        });
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <SummaryActivitiesContainer />
            </MuiThemeProvider>
        );
    }
}



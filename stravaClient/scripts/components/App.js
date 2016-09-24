import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

import MysqlServices from '../services/mysqlServices';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.mysql = new MysqlServices();
    }

    componentWillMount() {
        var self = this;
        const promises = this.mysql.initialize();
        Promise.all(promises).then( response => {
            console.log("mysql initialization complete");

            // athlete.id = "2843574";
            // athlete.firstName = "Ted";
            // athlete.lastName = "Shaffer";
            // athlete.email = "shaffer_family@yahoo.com";

            this.mysql.addAthlete("2843574", "fb8085cc4c7f3633533e875eae3dc1e04cef06e8", "Dad", "Ted", "Shaffer", "shaffer.family@gmail.com");
            this.mysql.addAthlete("7085811", "29ef6b106ea16378e27f6031c60a79a4d445d489", "Mom", "Lori", "Shaffer", "loriashaffer@gmail.com");

        }, (err) => {
            console.log("initialization failure:", err);
        });
    }

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        // load visualization package for later use
        window.google.load("visualization", "1", { packages: ["corechart"] });
    }
    
    render() {

        return (
            <div>pizza face</div>
        );
        // return (
        //     <MuiThemeProvider>
        //         <SummaryActivitiesContainer />
        //     </MuiThemeProvider>
        // );
    }
}



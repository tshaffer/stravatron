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
        this.mysql.initialize();
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



'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Report from './components/report.jsx';

require('./common.styl');

const App = () => (
    <MuiThemeProvider>
        <Report/>
    </MuiThemeProvider>
);

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <App/>,
        document.getElementById('root')
    );
});

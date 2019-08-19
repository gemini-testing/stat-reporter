'use strict';

import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';
import moment from 'moment';
import constants from '../../constants';
import utils from '../utils';

class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: []
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('report.json')
            .then((res) => res.json())
            .then(data => _.forEach(data, row => row.duration = moment(row.duration).format('mm:ss')))
            .then(data => this.setState({data, isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }

    drawDetailedTable(row) {
        const browser = row.original.browser;
        const data = utils.getNestedRows(this.state.data, browser);

        return (
            <div className="table-detail">
                <ReactTable
                    data = {data}
                    columns = {constants.nestedColumns}
                    defaultPageSize = {data.length}
                    showPagination = {false}
                />
            </div>
        );
    }

    drawFlatTable() {
        const {data} = this.state;
        return (
            <ReactTable
                data = {data}
                columns = {constants.flatColumns}
                defaultPageSize = {data.length}
                showPagination = {false}
            />
        );
    }

    drawNestedTable() {
        const data = utils.getAggregatedRows(this.state.data);

        return (
            <ReactTable
                data = {data}
                columns = {constants.aggregatedColumns}
                defaultPageSize = {data.length}
                showPagination = {false}
                SubComponent = {this.drawDetailedTable.bind(this)}
            />
        );
    }

    render() {
        const {data, isLoading, error} = this.state;

        if (error) {
            return <p className="error">{error.message}</p>;
        }

        if (isLoading) {
            return (
                <div className="loader">
                    <CircularProgress/>
                </div>
            );
        }

        return utils.isNested(data)
            ? this.drawNestedTable()
            : this.drawFlatTable();
    }
}

export default Report;

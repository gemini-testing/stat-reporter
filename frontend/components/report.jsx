'use strict';

import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';

/**
 * Функция сравнения, которая ставит '-' ниже всех значений
 * @see https://www.npmjs.com/package/react-table#custom-sorting-algorithm
 * @param {any} a
 * @param {any} b
 * @return {number}
 */
function compareDashLast(a, b) {
    if (a === '-' || b === '-') {
        if (a === b) {
            return 0;
        }
        if (a === '-') {
            return -1;
        }
        return 1;
    }

    // force null and undefined to the bottom
    a = a === null || a === undefined ? -Infinity : a;
    b = b === null || b === undefined ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
}

class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('report.json')
            .then((res) => res.json())
            .then(data => this.setState({data, isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }

    getColumns() {
        return [
            {
                Header: 'Browser',
                accessor: 'browser'
            },
            {
                Header: 'Status',
                accessor: 'status'
            },
            {
                Header: 'Tests',
                accessor: 'tests',
                defaultSortDesc: true
            },
            {
                Header: 'Passed',
                accessor: 'passed',
                defaultSortDesc: true
            },
            {
                Header: 'Failed',
                accessor: 'failed',
                defaultSortDesc: true
            },
            {
                Header: 'Skipped',
                accessor: 'skipped',
                defaultSortDesc: true
            },
            {
                Header: 'Retries',
                accessor: 'retries',
                defaultSortDesc: true
            }
        ];
    }

    getSubColumns() {
        const columns = this.getColumns();
        columns.splice(1, 0, {
            Header: 'Chunk',
            accessor: 'chunk'
        });
        columns.push({
            Header: 'Duration',
            accessor: 'duration'
        });
        return columns;
    }

    drawDetailTable(row) {
        const data = _.filter(this.state.data, (value) => {
            return value.browser === row.row.browser && value.chunk !== '-';
        });
        const columns = this.getSubColumns();

        return (
            <div className="table-detail">
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={data.length}
                    defaultSortMethod={compareDashLast}
                    showPagination={false}
                />
            </div>
        );
    }

    render() {
        let {data, isLoading, error} = this.state;

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

        data = _.filter(data, (row) => {
            return row.chunk === '-';
        });

        return (
            <ReactTable
                data = {data}
                columns = {this.getColumns()}
                defaultPageSize={data.length}
                defaultSortMethod={compareDashLast}
                showPagination={false}
                SubComponent={this.drawDetailTable.bind(this)}
            />
        );
    }
}

export default Report;

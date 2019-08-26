'use strict';

const _ = require('lodash');

exports.statuses = {
    PASSED: 'passed',
    FAILED: 'failed'
};

const commonColumns = [
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

const additionalColumns = {
    browser:
    {
        Header: 'Browser',
        accessor: 'browser'
    },
    chunk:
    {
        Header: 'Chunk',
        accessor: 'chunk'
    },
    duration:
    {
        Header: 'Duration',
        accessor: 'duration'
    },
    minDuration:
    {
        Header: 'Min duration',
        accessor: 'minDuration'
    },
    maxDuration:
    {
        Header: 'Max duration',
        accessor: 'maxDuration'
    }
};

exports.flatColumns = _.concat(
    additionalColumns.browser,
    commonColumns,
    additionalColumns.duration
);

exports.aggregatedColumns = _.concat(
    additionalColumns.browser,
    commonColumns,
    additionalColumns.minDuration,
    additionalColumns.maxDuration
);

exports.nestedColumns = _.concat(
    additionalColumns.chunk,
    commonColumns,
    additionalColumns.duration
);

import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם מתמודד',
        accessor: 'candidate.user.name',
        Filter: ColumnFilter
    },
    {
        Header: 'certjobpreferences',
        accessor: 'certjobpreferences',
        Filter: ColumnFilter
    },
    {
        Header: 'noncertjobpreferences',
        accessor: 'noncertjobpreferences',
        Filter: ColumnFilter
    },
]
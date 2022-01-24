import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם מחזור',
        accessor: 'name',
        Filter: ColumnFilter
    },
    // {
    //     Header: 'תאריך התחלה',
    //     accessor: 'startdate',
    //     Filter: ColumnFilter
    // },
    // {
    //     Header: 'תאריך סיום',
    //     accessor: 'enddate',
    //     Filter: ColumnFilter
    // },
    {
        Header: 'סוג מחזור',
        accessor: 'mahzoriosh',
        Filter: ColumnFilter
    },
    {
        Header: 'שנת איוש',
        accessor: 'year',
        Filter: ColumnFilter
    },
]
import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'שם מחזור',
        accessor: 'mahzor.name',
        Filter: ColumnFilter
    },
    {
        Header: 'שנת איוש',
        accessor: 'mahzor.year',
        Filter: ColumnFilter
    },
    {
        Header: 'סטטוס מחזור',
        accessor: 'mahzor.status',
        Filter: ColumnFilter
    },
]
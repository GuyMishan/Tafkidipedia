import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: '_id',
        Filter: ColumnFilter
    },
    {
        Header: 'יחידה',
        accessor: 'unit.name',
        Filter: ColumnFilter
    },
    {
        Header: 'מגזר',
        accessor: 'migzar',
        Filter: ColumnFilter
    },
    {
        Header: 'אופי התפקיד',
        accessor: 'character',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/לא ודאי',
        accessor: 'certain',
        Filter: ColumnFilter
    },
]
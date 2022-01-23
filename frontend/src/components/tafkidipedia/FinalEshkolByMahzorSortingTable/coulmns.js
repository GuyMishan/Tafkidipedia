import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: 'job',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/לא ודאי',
        accessor: 'job.certain',
        Filter: ColumnFilter
    },
    {
        Header: 'ערוך',
        accessor: '_id',
        Filter: ColumnFilter
    },
    {
        Header: 'מועמד סופי',
        accessor: 'finalcandidate',
        Filter: ColumnFilter
    },
    {
        Header: '',
        accessor: 'candidatesineshkol',
        Filter: ColumnFilter
    },
]
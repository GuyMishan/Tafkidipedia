import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: 'jobinmahzor',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/אופציה',
        accessor: 'jobinmahzor.job.certain',
        Filter: ColumnFilter
    },
    {
        Header: 'ערוך',
        accessor: '_id',
        Filter: ColumnFilter
    },
    {
        Header: '',
        accessor: 'candidatesineshkol',
        Filter: ColumnFilter
    },
]
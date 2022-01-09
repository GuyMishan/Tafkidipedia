import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: 'job.jobtype.jobname',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/לא ודאי',
        accessor: 'job.certain',
        Filter: ColumnFilter
    },
    {
        Header: '',
        accessor: 'preferencerankings',
        Filter: ColumnFilter
    },
]
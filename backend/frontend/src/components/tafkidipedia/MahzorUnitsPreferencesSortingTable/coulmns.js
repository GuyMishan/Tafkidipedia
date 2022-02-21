import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'תפקיד',
        accessor: 'jobinmahzor.job.jobname',
        Filter: ColumnFilter
    },
    {
        Header: 'ודאי/אופציה',
        accessor: 'jobinmahzor.certain',
        Filter: ColumnFilter
    },
    {
        Header: '',
        accessor: 'preferencerankings',
        Filter: ColumnFilter
    },
]
import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  function init() {
    getMahzorUnitsPreferences();
  }

  const getMahzorUnitsPreferences = async () => {//get + sort by mahzorid
    await axios.get(`http://localhost:8000/api/smartfinalunitpreference`)
      .then(async response => {
        let tempdata = response.data;
        let tempunitspreferences = [];
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].mahzor._id == match.params.mahzorid) {
            for (let j = 0; j < tempdata[i].preferencerankings.length; j++) {
              let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempdata[i].preferencerankings[j].candidate}`);
              tempdata[i].preferencerankings[j].candidate = result1.data[0];
              delete tempdata[i].preferencerankings[j].__v;
              delete tempdata[i].preferencerankings[j]._id;
              delete tempdata[i].preferencerankings[j].candidate.__v;
            }
            tempunitspreferences.push(tempdata[i])
          }
        }
        setData(tempunitspreferences)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    init();
    setPageSize(5);
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable({
    columns, data, initialState: { pageIndex: 0 },
  },
    useGlobalFilter, useFilters, useSortBy, usePagination);

  return (
    <>
      <div style={{ float: 'right' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - העדפות"
          sheet="קובץ - העדפות"
          buttonText="הורד כקובץ אקסל" />
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()} id="table-to-xls">
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              <th colSpan="1">תפקיד</th>
              <th colSpan="1">ודאי/לא ודאי</th>
              <th colSpan="100%">מועמדים</th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        // if (cell.column.id != "candidate.user.name") {
                        //   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        // }
                        // else {
                        if (cell.column.id == "job.jobtype.jobname") {
                          return <td><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${row.original.job._id}`}>{cell.value}{"/"}{row.original.job.unit.name}</Link></td>
                        }
                        if (cell.column.id == "job.certain") {
                          return <td>{cell.value == true ? "ודאי" : "לא ודאי"}</td>
                        }
                        if (cell.column.id == "preferencerankings") {
                          return <> {cell.value.map((preferenceranking, index) => (
                            <td><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${preferenceranking.candidate.user._id}`}>{preferenceranking.candidate.user.name} {preferenceranking.candidate.user.lastname}</Link> ({preferenceranking.rank})</td>
                          ))}</>
                        }
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className="pagination">

          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}

          <span>
            עמוד{' '}
            <strong>
              {pageIndex + 1} מתוך {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | חפש עמוד:{' '}
            <input

              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px', borderRadius: '10px' }}
            />
          </span>{' '}
          <select
            style={{ borderRadius: '10px' }}
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', paddingTop: '5px' }}>
          <h4 style={{ fontWeight: 'bold' }}>מספר העדפות: {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
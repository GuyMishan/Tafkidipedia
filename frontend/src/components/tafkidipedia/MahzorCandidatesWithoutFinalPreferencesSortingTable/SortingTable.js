import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  function init() {
    getMahzorCabdidateWithoutPreferences();
  }

  const getMahzorCabdidateWithoutPreferences = async () => {
    //get all mahzor candidates
    let result = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${match.params.mahzorid}`)
    let tempallcandidates = result.data;

    //get all candidates with a preference
    let response = await axios.get(`http://localhost:8000/api/smartfinalcandidatepreference`)
    let tempdata = response.data;
    let tempcandidateswithpreference = [];
    for (let i = 0; i < tempdata.length; i++) {
      if (tempdata[i].mahzor._id == match.params.mahzorid) {
        tempcandidateswithpreference.push(tempdata[i].candidate)
      }
    }

    //takes the original candidates array and saves only those without a preference
    for (let k = 0; k < tempallcandidates.length; k++) {
      for (let l = 0; l < tempcandidateswithpreference.length; l++)
        if (tempallcandidates[k]._id == tempcandidateswithpreference[l]._id)
        {
          tempallcandidates.splice(k,1);
        }
    }

    setData(tempallcandidates)
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
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()}>
          {data[0] ?
            <thead style={{ backgroundColor: '#4fff64' }}>
              <tr>
                <th colSpan="1" style={{ borderLeft: "1px solid white" }}>שם מתמודד</th>
              </tr>
            </thead> : null}

          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if (cell.column.id == "user.name") {
                          return <td style={{backgroundColor:'#FFCCCC'}}><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${row.original.user._id}`}>{cell.value}{" "}{row.original.user.lastname}</Link></td>
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
          <h4 style={{ fontWeight: 'bold' }}>מספר מתמודדים: {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
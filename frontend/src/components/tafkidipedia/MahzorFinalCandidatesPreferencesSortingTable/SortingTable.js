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
    getMahzorCabdidatePreferences();
  }

  const getMahzorCabdidatePreferences = async () => {//get + sort by mahzorid
    await axios.get(`http://localhost:8000/api/smartfinalcandidatepreference`)
      .then(async response => {
        let tempdata = response.data;
        let tempcandidatepreferences = [];
        for (let i = 0; i < tempdata.length; i++) {
          if (tempdata[i].mahzor._id == match.params.mahzorid) {
            for (let j = 0; j < tempdata[i].certjobpreferences.length; j++) {
              let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempdata[i].certjobpreferences[j]}`);
              tempdata[i].certjobpreferences[j] = result1.data;
              delete tempdata[i].certjobpreferences[j].__v;
              delete tempdata[i].certjobpreferences[j]._id;
              let result2 = await axios.get(`http://localhost:8000/api/jobbyid/${tempdata[i].certjobpreferences[j].job}`);
              tempdata[i].certjobpreferences[j].job = result2.data[0];
            }
            for (let j = 0; j < tempdata[i].noncertjobpreferences.length; j++) {
              let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempdata[i].noncertjobpreferences[j]}`);
              tempdata[i].noncertjobpreferences[j] = result1.data;
              delete tempdata[i].noncertjobpreferences[j].__v;
              delete tempdata[i].noncertjobpreferences[j]._id;
              let result2 = await axios.get(`http://localhost:8000/api/jobbyid/${tempdata[i].noncertjobpreferences[j].job}`);
              tempdata[i].noncertjobpreferences[j].job = result2.data[0];
            }
            tempcandidatepreferences.push(tempdata[i])
          }
        }
        setData(tempcandidatepreferences)
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
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table {...getTableProps()}>
          {data[0] ?
            <thead style={{ backgroundColor: '#4fff64' }}>
              <tr>
                <th colSpan="1" style={{borderLeft: "1px solid white"}}>שם מתמודד</th>
                <th colSpan={data[0].mahzor.numberofjobpicks} style={{borderLeft: "1px solid white"}}>תפקידים ודאי</th>
                <th colSpan={data[0].mahzor.numberofjobpicks}>תפקידים לא ודאי</th>
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
                        if (cell.column.id == "candidate.user.name") {
                          return <td>{cell.value}{" "}{row.original.candidate.user.lastname}</td>
                        }
                        if (cell.column.id == "certjobpreferences") {
                          return <> {cell.value.map((jobpreference, index) => (
                            <td>{jobpreference.job.jobtype.jobname}/{jobpreference.job.unit.name} ({jobpreference.rank})</td>
                          ))}</>
                        }
                        if (cell.column.id == "noncertjobpreferences") {
                          return <> {cell.value.map((jobpreference, index) => (
                            <td>{jobpreference.job.jobtype.jobname}/{jobpreference.job.unit.name} ({jobpreference.rank})</td>
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
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
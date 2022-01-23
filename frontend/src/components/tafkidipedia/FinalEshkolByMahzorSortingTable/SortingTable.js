import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

const SortingTable = (props) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  function init() {
    getMahzorEshkol();
  }

  const getMahzorEshkol = async () => {
    let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${props.mahzorid}`)
    let tempeshkolbymahzorid = response.data;
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempeshkolbymahzorid[i].candidatesineshkol[j].candidate}`);
        tempeshkolbymahzorid[i].candidatesineshkol[j].candidate = result1.data[0];
      }
      if (tempeshkolbymahzorid[i].finalcandidate) {
        let result2 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempeshkolbymahzorid[i].finalcandidate}`);
        tempeshkolbymahzorid[i].finalcandidate = result2.data[0];
      }
    }
    setData(tempeshkolbymahzorid)
  }

  useEffect(() => {
    // init();
    setPageSize(5);
  }, []);

  useEffect(() => {
    init()
  }, [props.refresh]);

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
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              <th colSpan="1">תפקיד</th>
              <th colSpan="1">ודאי/לא ודאי</th>
              <th colSpan="1">ערוך</th>
              <th colSpan="1">מועמד סופי</th>
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
                        if (cell.column.id == "job") {
                          return <td><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${cell.value._id}`}> {cell.value.jobtype.jobname}/{cell.value.unit.name}</Link></td>
                        }
                        if (cell.column.id == "job.certain") {
                          return <td>{cell.value == true ? "ודאי" : "לא ודאי"}</td>
                        }
                        if (cell.column.id == "_id") {
                          return <td><Link to={`/editeshkol/${false}/${cell.value}`}><button className="btn btn-success" style={{ padding: "0.5rem" }}>ערוך אשכול</button></Link></td>
                        }
                        if (cell.column.id == "finalcandidate") {
                          if (cell.value) {
                          return <td><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${cell.value.user._id}`}>{cell.value.user.name} {cell.value.user.lastname}</Link></td>
                          }
                          else{
                            return <td>-</td>
                          }
                        }
                        if (cell.column.id == "candidatesineshkol") {
                          return <> {cell.value.map((candidateineshkol, index) => (
                            (candidateineshkol.candidaterank && candidateineshkol.unitrank) ?
                              <td style={{ backgroundColor: 'rgb(190 255 184)' }}>
                                <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${candidateineshkol.candidate.user._id}`}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</Link>
                                {candidateineshkol.candidaterank ? <p>דירוג מתמודד:{candidateineshkol.candidaterank}</p> : null}
                                {candidateineshkol.unitrank ? <p>דירוג יחידה:{candidateineshkol.unitrank}</p> : null}
                              </td>
                              :
                              (candidateineshkol.candidaterank && !candidateineshkol.unitrank) ?
                                <td style={{ backgroundColor: 'rgb(255 204 204)' }}>
                                  <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${candidateineshkol.candidate.user._id}`}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</Link>
                                  {candidateineshkol.candidaterank ? <p>דירוג מתמודד:{candidateineshkol.candidaterank}</p> : null}
                                </td>
                                :
                                (!candidateineshkol.candidaterank && candidateineshkol.unitrank) ?
                                  <td style={{ backgroundColor: 'rgb(255 248 204)' }}>
                                    <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${candidateineshkol.candidate.user._id}`}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</Link>
                                    {candidateineshkol.unitrank ? <p>דירוג יחידה:{candidateineshkol.unitrank}</p> : null}
                                  </td>
                                  : <td style={{ backgroundColor: 'rgb(208 204 255)' }}>
                                    <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${candidateineshkol.candidate.user._id}`}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</Link>
                                    <p>הוסף ע"י מנהל מערכת</p>
                                  </td>
                          ))}</>
                        }
                      })
                    }
                    {/* {console.log(row)} */}
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
          <h4 style={{ fontWeight: 'bold' }}>מספר אשכולות : {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
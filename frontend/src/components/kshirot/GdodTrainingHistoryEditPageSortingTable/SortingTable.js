import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from './GlobalFilter'
import axios from 'axios'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([])

  const [gdod, setGdod] = useState([])

  function init() {
    getGdod();
  }

  const getGdod = async () => {
    var tempgdodid = match.params.gdodid;
    try {
      await axios.post(`http://localhost:8000/api/gdod/gdodbyid`, [tempgdodid])
        .then(response => {
          setGdod(response.data[0]);
          getGdodTrainingHistory(response.data[0]);
        })
        .catch((error) => {
          console.log(error);
        })
    }
    catch {

    }
  }

  const getGdodTrainingHistory = async (tempgdod) => {
    var tempgdodtraininghistorydata = [];
    for (let i = tempgdod.traininghistory.length - 1; i >= 0; i--) {
      try {
        await axios.get(`http://localhost:8000/api/training/${tempgdod.traininghistory[i]}`)
          .then(response => {
            tempgdodtraininghistorydata.push(response.data[0]);
          })
          .catch((error) => {
            console.log(error);
          })
      }
      catch {

      }
    }
    // console.log(tempgdodhistorykshirotsdata);
    setData(tempgdodtraininghistorydata);
  }
  const TrainingDelete = trainingId => {
    var tempgdodhistorytrainings = data;
    for (var i = tempgdodhistorytrainings.length - 1; i >= 0; --i) {
      if (tempgdodhistorytrainings[i]._id == trainingId) {
        tempgdodhistorytrainings.splice(i, 1);
      }
    }
    axios.post(`http://localhost:8000/api/training/remove/${trainingId}`)
      .then(response => {
        axios.post(`http://localhost:8000/api/gdod/updatealltraininghistoryarray`, [gdod._id, tempgdodhistorytrainings])
          .then(res => {
            getGdod()
          })
          .catch(error => {

          })
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
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th  >
                    <div {...column.getHeaderProps(column.getSortByToggleProps())}> {column.render('Header')} </div>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                    <div>
                      {column.isSorted ? (column.isSortedDesc ? '🔽' : '⬆️') : ''}
                    </div>
                  </th>
                ))}
                <th></th>
              </tr>
            ))}

          </thead>
          <tbody {...getTableBodyProps()}>
            {
              page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell => {
                        if ((cell.column.id != "createdAt") && (cell.column.id != "updatedAt")) {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        }
                        else {
                          if (cell.column.id == "createdAt") {
                            return <td>{cell.value.slice(0, 10)}</td>
                          }
                          if (cell.column.id == "updatedAt") {
                            return <td>{cell.value.slice(0, 10)}</td>
                          }
                        }
                      })
                    }
                    {row.id != '0' ?
                      <td role="cell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link to={`/edittrainingonly/${row.original._id}/${gdod._id}`}><button className="btn btn-success" style={{padding:'0.5rem'}}><img src={editpic} alt="bookmark" style={{height:'2rem'}}/></button></Link>
                        <Link><button className="btn btn-danger" onClick={() => TrainingDelete(row.original._id)} style={{padding:'0.5rem'}}><img src={deletepic} alt="bookmark" style={{height:'2rem'}}/></button></Link>
                      </td>
                      :
                      <td role="cell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <Link to={`/edittrainingonly/${row.original._id}/${gdod._id}`}><button className="btn btn-success" style={{padding:'0.5rem'}}><img src={editpic} alt="bookmark" style={{height:'2rem'}}/></button></Link> </div>{/*row.original._id=user._id*/}
                      </td>
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
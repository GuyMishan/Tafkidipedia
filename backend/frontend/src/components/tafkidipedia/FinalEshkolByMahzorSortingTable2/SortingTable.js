import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SortingTable = (props) => {

  const [data, setData] = useState([])

  const [highestnumber, setHighestnumber] = useState(0)

  function init() {
    getMahzorEshkol();
  }

  const getMahzorEshkol = async () => {
    let temhighestnumber = highestnumber;
    let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${props.mahzorid}`)
    let tempeshkolbymahzorid = response.data;
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      if (tempeshkolbymahzorid[i].candidatesineshkol.length >= temhighestnumber) {
        temhighestnumber = tempeshkolbymahzorid[i].candidatesineshkol.length;
      }
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
    setHighestnumber(temhighestnumber)
  }

  useEffect(() => {
    init()
  }, [props.refresh]);

  return (
    <>
      <div style={{ float: 'right' }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn-green"
          table="table-to-xls"
          filename="קובץ - אשכולות"
          sheet="קובץ - אשכולות"
          buttonText="הורד כקובץ אקסל" />
      </div>
      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              {data.map(eshkol => {
                return (
                  <th><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/displayjob/${eshkol.jobinmahzor._id}`}> {eshkol.jobinmahzor.job.jobname}/{eshkol.jobinmahzor.job.unit.name}/{eshkol.jobinmahzor.job.certain}</Link></th>
                )
              }
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              {data.map(eshkol => {
                if (props.editable)
                  return (
                    <td><Link to={`/editeshkol/${false}/${eshkol._id}`}><button className="btn btn-success" style={{ padding: "0.5rem" }}>ערוך אשכול</button></Link></td>)
              })}
            </tr>
            {[...Array(highestnumber)].map((x, i) => {
              return (<tr>
                {data.map(eshkol => {
                  return (
                    eshkol.candidatesineshkol[i] && (eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                      <td className="greencell">
                        <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                        {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                      </td>
                      : eshkol.candidatesineshkol[i] && (eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                        <td className="redcell">
                          <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                          {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        </td> : eshkol.candidatesineshkol[i] && (!eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                          <td className="yellowcell">
                            <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                            {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                          </td> : eshkol.candidatesineshkol[i] && (!eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                            <td className="bluecell">
                              <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                              <p>הוסף ע"י מנהל מערכת</p>
                            </td> : <td></td>)
                })}
              </tr>)
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', paddingTop: '5px' }}>
          <h4 style={{ fontWeight: 'bold' }}>מספר אשכולות : {data.length}</h4>
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
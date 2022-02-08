import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'
import style from 'components/Table.css'
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import MigzarFilter from 'components/tafkidipedia/Filters/MigzarFilter';
import CertainFilter from 'components/tafkidipedia/Filters/CertainFilter';
import UnitFilter from 'components/tafkidipedia/Filters/UnitFilter';

const SortingTable = (props) => {
  const [data, setData] = useState([])
  const [highestnumber, setHighestnumber] = useState(0)

  const [migzarfilter, setMigzarfilter] = useState(undefined)
  const [unitfilter, setUnitfilter] = useState(undefined)
  const [certainfilter, setCertainfilter] = useState(undefined)

  function init() {
    getMahzorEshkol();
  }

  const getMahzorEshkol = async () => {
    let temhighestnumber = 0;
    let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${props.mahzorid}`)
    let tempeshkolbymahzorid_beforefilters = response.data;
    let tempeshkolbymahzorid;

    //to filter eshkols
    if (migzarfilter != undefined) {
      if (unitfilter != undefined) {
        if (certainfilter != undefined) {
          tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
            return el.jobinmahzor.job.migzar == migzarfilter &&
              el.jobinmahzor.job.certain == certainfilter &&
              el.jobinmahzor.job.unit.name == unitfilter;
          });
        }
        else {
          tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
            return el.jobinmahzor.job.migzar == migzarfilter &&
              el.jobinmahzor.job.unit.name == unitfilter;
          });
        }
      }
      else {
        tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
          return el.jobinmahzor.job.migzar == migzarfilter;
        });
      }
    }
    else {
      tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters
    }

    //to get candidates data + calc highest num of candidates per job
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
  }, [migzarfilter, certainfilter]);

  return (
    <>
      <MigzarFilter data={data} setMigzarfilter={setMigzarfilter} migzarfilter={migzarfilter} />
      <UnitFilter data={data} setUnitfilter={setUnitfilter} unitfilter={unitfilter} migzarfilter={migzarfilter} certainfilter={certainfilter} />
      <CertainFilter data={data} setCertainfilter={setCertainfilter} certainfilter={certainfilter} unitfilter={unitfilter} />

      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              {data.length > 0 ? <th></th> : null}
              {data.map(eshkol => {
                return (
                  <th><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/editeshkol/${false}/${eshkol._id}`}>{eshkol.jobinmahzor.job.unit.name} / {eshkol.jobinmahzor.job.jobname}</Link><h5 style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit',margin:'0px'}}>{eshkol.jobinmahzor.job.certain}</h5></th>
                )
              }
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              {data.length > 0 ? <th>שיבוץ סופי</th> : null}
              {data.map(eshkol => {
                return (
                  eshkol.finalcandidate ?
                    <td><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.finalcandidate.user._id}`}>{eshkol.finalcandidate.user.name} {eshkol.finalcandidate.user.lastname}</Link></td>
                    : <td></td>)
              })}
            </tr>
            {/* <tr>
              {data.length > 0 ? <th></th> : null}
              {data.map(eshkol => {
                if (props.editable)
                  return (
                    <td><Link to={`/editeshkol/${false}/${eshkol._id}`}><button className="btn btn-success" style={{ padding: "0.5rem" }}>ערוך אשכול</button></Link></td>)
              })}
            </tr> */}
            {[...Array(highestnumber)].map((x, i) => {
              return (<tr>
                {data.length > 0 ? <th></th> : null}
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
        <div style={{ display: 'flex', justifyContent:'center',textAlign:'center' }}>
        {data.length == 0 ? <h2 style={{ fontWeight: 'bold' }}>אין נתונים בטבלה</h2> : null}
        </div>
        <div style={{ display: 'flex', paddingTop: '5px' }}>
          <h4 style={{ fontWeight: 'bold' }}>מספר אשכולות : {data.length}</h4>
        </div>
        <div style={{ float: 'right' }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn-green"
            table="table-to-xls"
            filename="קובץ - אשכולות"
            sheet="קובץ - אשכולות"
            buttonText="הורד כקובץ אקסל" />
        </div>
      </div>
    </>
  );
}
export default withRouter(SortingTable);;
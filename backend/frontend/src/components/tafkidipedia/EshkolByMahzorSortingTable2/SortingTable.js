import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import axios from 'axios'

import { Card, CardHeader, CardBody, CardTitle, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Row } from 'reactstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import MigzarFilter from 'components/tafkidipedia/Filters/MigzarFilter';
import CertainFilter from 'components/tafkidipedia/Filters/CertainFilter';
import UnitFilter from 'components/tafkidipedia/Filters/UnitFilter';
import EditEshkolFormModal from "views/general/adminpages/editeshkol/EditEshkolFormModal";

const SortingTable = (props) => {
  const [data, setData] = useState([])
  const [originaldata, setOriginaldata] = useState([])
  const [candidatesinmahzor, setCandidatesinmahzor] = useState([])
  const [highestnumber, setHighestnumber] = useState(0)

  const [migzarfilter, setMigzarfilter] = useState(undefined)
  const [unitfilter, setUnitfilter] = useState(undefined)
  const [certainfilter, setCertainfilter] = useState(undefined)

  const [iseshkolformopen, setIseshkolformopen] = useState(false);
  const [eshkolidformodal, setEshkolidformodal] = useState(undefined);

  function Toggle(evt) {
    setEshkolidformodal(evt.target.value)
    setIseshkolformopen(!iseshkolformopen);
  }

  function ToggleForModal(evt) {
    setIseshkolformopen(!iseshkolformopen);
    updatechangedeshkol();
  }

  async function updatechangedeshkol() {
    let response = await axios.get(`http://localhost:8000/api/eshkolbyid/${eshkolidformodal}`)
    let tempeshkol = response.data[0];
    let temhighestnumber = tempeshkol.candidatesineshkol.length;


    for (let j = 0; j < tempeshkol.candidatesineshkol.length; j++) {
      for (let k = 0; k < candidatesinmahzor.length; k++) {
        if (tempeshkol.candidatesineshkol[j].candidate == candidatesinmahzor[k]._id) {
          tempeshkol.candidatesineshkol[j].candidate = candidatesinmahzor[k];
        }
      }
    }

    let tempdata = [...data];
    let temporiginaldata = [...originaldata];

    for (let i = 0; i < tempdata.length; i++) {
      if (eshkolidformodal == tempdata[i]._id) {
        tempdata[i] = {...tempeshkol};
      }
    }

    for (let i = 0; i < temporiginaldata.length; i++) {
      if (eshkolidformodal == temporiginaldata[i]._id) {
        temporiginaldata[i] = {...tempeshkol};
      }
    }

    setOriginaldata(temporiginaldata)
    setData(tempdata)

    if (temhighestnumber >= highestnumber) {
      setHighestnumber(temhighestnumber)
    }
  }

  function init() {
    getCandidatesinmahzor();
  }

  const getCandidatesinmahzor = async () => {
    let response = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${props.mahzorid}`)
    let tempcandidatesinmahzor = response.data;

    setCandidatesinmahzor(tempcandidatesinmahzor)
  }

  const getMahzorEshkol = async () => {
    let temhighestnumber = 0;
    let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${props.mahzorid}`)
    let tempeshkolbymahzorid = response.data;

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      if (tempeshkolbymahzorid[i].candidatesineshkol.length >= temhighestnumber) {
        temhighestnumber = tempeshkolbymahzorid[i].candidatesineshkol.length;
      }
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        for (let k = 0; k < candidatesinmahzor.length; k++) {
          if (tempeshkolbymahzorid[i].candidatesineshkol[j].candidate == candidatesinmahzor[k]._id) {
            tempeshkolbymahzorid[i].candidatesineshkol[j].candidate = candidatesinmahzor[k];
          }
        }
      }
    }

    setOriginaldata(tempeshkolbymahzorid)
    setData(tempeshkolbymahzorid)
    setHighestnumber(temhighestnumber)
  }

  const FilterEshkols = async () => {
    let temhighestnumber = 0;
    let tempeshkolbymahzorid = [];
    let tempeshkolbymahzorid_beforefilters = originaldata;

    //to filter eshkols
    if (migzarfilter != undefined) {
      if (unitfilter != undefined) {
        if (certainfilter != undefined) {
          tempeshkolbymahzorid = tempeshkolbymahzorid_beforefilters.filter(function (el) {
            return el.jobinmahzor.job.migzar == migzarfilter &&
              el.jobinmahzor.certain == certainfilter &&
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
          return el.jobinmahzor.job.migzar == migzarfilter
        });
      }
    }
    else {
      tempeshkolbymahzorid = originaldata
    }

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      if (tempeshkolbymahzorid[i].candidatesineshkol.length >= temhighestnumber) {
        temhighestnumber = tempeshkolbymahzorid[i].candidatesineshkol.length;
      }
    }

    setData(tempeshkolbymahzorid)
    setHighestnumber(temhighestnumber)
  }

  useEffect(() => {
    getMahzorEshkol()
  }, [candidatesinmahzor]);

  useEffect(() => {
    FilterEshkols()
  }, [migzarfilter, unitfilter, certainfilter]);

  useEffect(() => {
    init()
  }, []);

  return (
    <>
      <EditEshkolFormModal isOpen={iseshkolformopen} eshkolid={eshkolidformodal} iseshkol={'true'} Toggle={Toggle} ToggleForModal={ToggleForModal} />
      <MigzarFilter data={data} setMigzarfilter={setMigzarfilter} migzarfilter={migzarfilter} />
      <UnitFilter data={data} setUnitfilter={setUnitfilter} unitfilter={unitfilter} migzarfilter={migzarfilter} certainfilter={certainfilter} />
      <CertainFilter data={data} setCertainfilter={setCertainfilter} certainfilter={certainfilter} unitfilter={unitfilter} />

      <div className="table-responsive" style={{ overflow: 'auto' }}>
        <table id="table-to-xls">
          <thead style={{ backgroundColor: '#4fff64' }}>
            <tr>
              {data && data.length>0 ?data.map(eshkol => {
                return (
                  // <th><Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/editeshkol/${true}/${eshkol._id}`}>{eshkol.jobinmahzor.job.unit.name} / {eshkol.jobinmahzor.job.jobname}</Link><h5 style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit', margin: '0px' }}>{eshkol.jobinmahzor.certain}</h5></th>
                  <th>
                    <Button value={eshkol._id} onClick={Toggle} style={{ width: '100%' }}>{eshkol.jobinmahzor.job.unit.name} / {eshkol.jobinmahzor.job.jobname}</Button>
                    <h5 style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit', margin: '0px' }}>{eshkol.jobinmahzor.certain}</h5>
                  </th>
                )
              }
              ):null}
            </tr>
          </thead>
          <tbody>
            {[...Array(highestnumber)].map((x, i) => {
              return (<tr>
                {data && data.length>0 ? data.map(eshkol => {
                  return (
                    eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                      <td className="greencell">
                        <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                        {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                      </td>
                      : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                        <td className="redcell">
                          <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                          {eshkol.candidatesineshkol[i].candidaterank ? <p>דירוג מתמודד:{eshkol.candidatesineshkol[i].candidaterank}</p> : null}
                        </td>
                        : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (!eshkol.candidatesineshkol[i].candidaterank && eshkol.candidatesineshkol[i].unitrank) ?
                          <td className="yellowcell">
                            <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                            {eshkol.candidatesineshkol[i].unitrank ? <p>דירוג יחידה:{eshkol.candidatesineshkol[i].unitrank}</p> : null}
                          </td>
                          : eshkol.candidatesineshkol[i] && eshkol.candidatesineshkol[i].candidate.user && (!eshkol.candidatesineshkol[i].candidaterank && !eshkol.candidatesineshkol[i].unitrank) ?
                            <td className="bluecell">
                              <Link style={{ color: 'inherit', textDecoration: 'inherit', fontWeight: 'inherit' }} to={`/profilepage/${eshkol.candidatesineshkol[i].candidate.user._id}`}>{eshkol.candidatesineshkol[i].candidate.user.name} {eshkol.candidatesineshkol[i].candidate.user.lastname}</Link>
                              <p>הוסף ע"י מנהל מערכת</p>
                            </td>
                            : <td></td>)
                }):null}
              </tr>)
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
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
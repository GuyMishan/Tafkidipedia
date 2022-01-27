import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Alert,
  Spinner,
  Label,
  Col
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";

const CandidatePreferenceForm = ({ match }) => {
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  //mahzor

  //jobs
  const [certmahzorjobs, setCertMahzorJobs] = useState([]);
  const [noncertmahzorjobs, setNonCertMahzorJobs] = useState([]);
  //jobs

  //old-preference
  const [oldcandidatepreference, setOldcandidatePreference] = useState({})
  //old-preference

  //preference
  const [candidatepreference, setCandidatePreference] = useState({})
  //preference

  function handleChangecertjobpreferences(evt) {
    const value = evt.target.value;
    const index = parseInt(evt.target.name);
    let rank = index + 1;

    let tempcandidatepreference = [...candidatepreference.certjobpreferences];
    tempcandidatepreference[index] = { job: value, rank: rank }
    setCandidatePreference({ ...candidatepreference, certjobpreferences: tempcandidatepreference });
  }

  function handleChangenoncertjobpreferences(evt) {
    const value = evt.target.value;
    const index = parseInt(evt.target.name);
    let rank = index + 1;

    let tempcandidatepreference = [...candidatepreference.noncertjobpreferences];
    tempcandidatepreference[index] = { job: value, rank: rank }
    setCandidatePreference({ ...candidatepreference, noncertjobpreferences: tempcandidatepreference });
  }

  const loadmahzor = async () => {
    await axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        // tempmahzor.startdate = tempmahzor.startdate.slice(0, 10);
        // tempmahzor.enddate = tempmahzor.enddate.slice(0, 10);
        setMahzorData(tempmahzor);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadcandidatepreference = async () => {
    let tempcandidatepreferencedata; //look for existing preference

    if(mahzordata.status == 2)
    {
      let result = await axios.get(`http://localhost:8000/api/candidatepreference/candidatepreferencebycandidateid/${match.params.candidateid}`);
      tempcandidatepreferencedata = result.data[0];
    }
    else if(mahzordata.status == 4)
    {
      let result = await axios.get(`http://localhost:8000/api/finalcandidatepreference/finalcandidatepreferencebycandidateid/${match.params.candidateid}`);
      tempcandidatepreferencedata = result.data[0];
    }

    if (tempcandidatepreferencedata) //has existing pref
    {
      for (let i = 0; i < tempcandidatepreferencedata.certjobpreferences.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatepreferencedata.certjobpreferences[i]}`);
        tempcandidatepreferencedata.certjobpreferences[i] = result1.data;
        delete tempcandidatepreferencedata.certjobpreferences[i].__v;
        delete tempcandidatepreferencedata.certjobpreferences[i]._id;
      }
      for (let i = 0; i < tempcandidatepreferencedata.noncertjobpreferences.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatepreferencedata.noncertjobpreferences[i]}`);
        tempcandidatepreferencedata.noncertjobpreferences[i] = result1.data;
        delete tempcandidatepreferencedata.noncertjobpreferences[i].__v;
        delete tempcandidatepreferencedata.noncertjobpreferences[i]._id;
      }

      delete tempcandidatepreferencedata.mahzor;
      delete tempcandidatepreferencedata.candidate;
      setCandidatePreference(tempcandidatepreferencedata)

      if( mahzordata.status == 2)
      {
      let tempoldcandidatepreferencedata; //if has existing preference save the old one
      let oldresult = await axios.get(`http://localhost:8000/api/candidatepreference/candidatepreferencebycandidateid/${match.params.candidateid}`);
      tempoldcandidatepreferencedata = oldresult.data[0];
      setOldcandidatePreference(tempoldcandidatepreferencedata)
      }
      else if( mahzordata.status == 4)
      {
      let tempoldcandidatepreferencedata; //if has existing preference save the old one
      let oldresult = await axios.get(`http://localhost:8000/api/finalcandidatepreference/finalcandidatepreferencebycandidateid/${match.params.candidateid}`);
      tempoldcandidatepreferencedata = oldresult.data[0];
      setOldcandidatePreference(tempoldcandidatepreferencedata)
      }
    }
    else { //dont have existing pref
      let tempcandidatepreferencedata2 = {};
      tempcandidatepreferencedata2.certjobpreferences = []
      tempcandidatepreferencedata2.noncertjobpreferences = []
      setCandidatePreference(tempcandidatepreferencedata2)
    }
    // console.log(tempcandidatepreferencedata)
  }

  const loadmahzorjobs = async () => {
    let tempcertjobs = [];
    let tempnoncertjobs = [];

    let result = await axios.get(`http://localhost:8000/api/jobsbymahzorid/${match.params.mahzorid}`)
    let jobs = result.data;

    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].certain == true) // תפקיד ודאי
      {
        let tempjob = jobs[i];
        tempcertjobs.push(tempjob)
      }
      else {// תפקיד לא ודאי
        let tempjob = jobs[i];
        tempnoncertjobs.push(tempjob)
      }

    }
    setCertMahzorJobs(tempcertjobs);
    setNonCertMahzorJobs(tempnoncertjobs);
  }

  const clickSubmit = event => {//CheckPreferenceData->AddPreferenceToDb
    if (CheckPreferenceData() == true)
      AddPreferenceToDb();
  }

  function CheckPreferenceData() {
    let flag = true;
    let certjobsemptyflag = true;
    let noncertjobsemptyflag = true;
    let certjobsflag = true;
    let noncertjobsflag = true;
    let error = [];

    if (candidatepreference.certjobpreferences.length != mahzordata.numberofjobpicks) //ודאי-בדיקה
    {
      certjobsemptyflag = false;
    }

    if (candidatepreference.noncertjobpreferences.length != mahzordata.numberofjobpicks) //לא ודאי-בדיקה
    {
      noncertjobsemptyflag = false;
    }

    //ודאי-בדיקה
    for (let i = 0; i < candidatepreference.certjobpreferences.length - 1; i++) {
      if (candidatepreference.certjobpreferences[i] == null || candidatepreference.certjobpreferences[i] == undefined) {
        certjobsemptyflag = false;
        break;
      }
      if (candidatepreference.certjobpreferences[i] ? candidatepreference.certjobpreferences[i].job == "בחר תפקיד" : false) {
        certjobsemptyflag = false;
        break;
      }
      for (let j = i + 1; j < candidatepreference.certjobpreferences.length; j++) {
        if (candidatepreference.certjobpreferences[i].job == candidatepreference.certjobpreferences[j].job) {
          certjobsflag = false;
        }
      }
    }

    //לא ודאי- בדיקה
    for (let i = 0; i < candidatepreference.noncertjobpreferences.length - 1; i++) {
      if (candidatepreference.noncertjobpreferences[i] == null || candidatepreference.noncertjobpreferences[i] == undefined) {
        noncertjobsemptyflag = false;
        break;
      }
      if (candidatepreference.noncertjobpreferences[i] ? candidatepreference.noncertjobpreferences[i].job == "בחר תפקיד" : false) {
        noncertjobsemptyflag = false;
        break;
      }
      for (let j = i + 1; j < candidatepreference.noncertjobpreferences.length; j++) {
        if (candidatepreference.noncertjobpreferences[i].job == candidatepreference.noncertjobpreferences[j].job) {
          noncertjobsflag = false;
        }
      }
    }

    //
    if (certjobsemptyflag == false)
      error.push('יש להזין את כל ההעדפות - ודאי')
    if (certjobsflag == false)
      error.push('אין להזין אותו תפקיד פעמיים - ודאי')

    if (noncertjobsemptyflag == false)
      error.push('יש להזין את כל ההעדפות - לא ודאי')
    if (noncertjobsflag == false)
      error.push('אין להזין אותו תפקיד פעמיים - לא ודאי')
    //

    if (error.length != 0) {
      for (let i = 0; i < error.length; i++)
        toast.error(error[i])
      flag = false;
    }
    return flag;
  }

  async function AddPreferenceToDb() { //if candidatepref has id- means it exists and needs to be updated else its new..
    let tempcandidatepreference = candidatepreference;
    tempcandidatepreference.mahzor = match.params.mahzorid;
    tempcandidatepreference.candidate = match.params.candidateid;

    if (!tempcandidatepreference._id) {
      //create all candidate preference rankings 
      let tempcandidatepreference_certjobpreferencesid = [];
      let tempcandidatepreference_noncertjobpreferencesid = [];

      for (let i = 0; i < tempcandidatepreference.certjobpreferences.length; i++) {
        await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcandidatepreference.certjobpreferences[i])
          .then(res => {
            tempcandidatepreference_certjobpreferencesid.push(res.data._id)
          })
      }
      for (let i = 0; i < tempcandidatepreference.noncertjobpreferences.length; i++) {
        await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcandidatepreference.noncertjobpreferences[i])
          .then(res => {
            tempcandidatepreference_noncertjobpreferencesid.push(res.data._id)
          })
      }

      //create new candidate preference
      tempcandidatepreference.certjobpreferences = tempcandidatepreference_certjobpreferencesid;
      tempcandidatepreference.noncertjobpreferences = tempcandidatepreference_noncertjobpreferencesid;

      if( mahzordata.status == 2)
      {
      await axios.post(`http://localhost:8000/api/candidatepreference`, tempcandidatepreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
      }
      else if( mahzordata.status == 4)
      {
        await axios.post(`http://localhost:8000/api/finalcandidatepreference`, tempcandidatepreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
      }
    }

    else {
      // delete all previous preference rankings
      for (let i = 0; i < oldcandidatepreference.certjobpreferences.length; i++) {
        await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${oldcandidatepreference.certjobpreferences[i]}`)
          .then(res => {

          })
      }
      for (let i = 0; i < oldcandidatepreference.noncertjobpreferences.length; i++) {
        await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${oldcandidatepreference.noncertjobpreferences[i]}`)
          .then(res => {

          })
      }

      // create all candidate preference rankings
      let tempcandidatepreference_certjobpreferencesid = [];
      let tempcandidatepreference_noncertjobpreferencesid = [];

      for (let i = 0; i < tempcandidatepreference.certjobpreferences.length; i++) {
        await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcandidatepreference.certjobpreferences[i])
          .then(res => {
            tempcandidatepreference_certjobpreferencesid.push(res.data._id)
          })
      }
      for (let i = 0; i < tempcandidatepreference.noncertjobpreferences.length; i++) {
        await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcandidatepreference.noncertjobpreferences[i])
          .then(res => {
            tempcandidatepreference_noncertjobpreferencesid.push(res.data._id)
          })
      }

      //update candidate preference
      tempcandidatepreference.certjobpreferences = tempcandidatepreference_certjobpreferencesid;
      tempcandidatepreference.noncertjobpreferences = tempcandidatepreference_noncertjobpreferencesid;
      let candidateidtochange=tempcandidatepreference._id;
      delete tempcandidatepreference._id;

      if( mahzordata.status == 2)
      {
      await axios.put(`http://localhost:8000/api/candidatepreference/${candidateidtochange}`, tempcandidatepreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
      }
      else if( mahzordata.status == 4)
      {
        await axios.put(`http://localhost:8000/api/finalcandidatepreference/${candidateidtochange}`, tempcandidatepreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
      }
    }
  }

  function init() {
    loadmahzor()
    loadmahzorjobs()
  }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    loadcandidatepreference()
  }, [mahzordata])

  return (
    mahzordata.status == 2 || mahzordata.status == 4 ?
      <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
        <Row>
          <Card>
            <CardHeader style={{ direction: 'rtl' }}>
              <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס העדפות מועמד</CardTitle>{/*headline*/}
            </CardHeader>

            <CardBody style={{ direction: 'rtl' }}>
              <Container>
                {/*edit existing*/}
                {(candidatepreference.certjobpreferences && candidatepreference._id) ?
                  <>
                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                          <FormGroup dir="rtl" >
                            <Input type="select" name={i} value={candidatepreference.certjobpreferences[i].job} onChange={handleChangecertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {certmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.jobtype.jobname + "/" + job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>)}
                    </Row>


                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - לא ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                          <FormGroup dir="rtl" >
                            <Input type="select" name={i} value={candidatepreference.noncertjobpreferences[i].job} onChange={handleChangenoncertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {noncertmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.jobtype.jobname + "/" + job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>)}
                    </Row>
                  </>
                  : null}

                {/*edit new*/}
                {(candidatepreference.certjobpreferences && !candidatepreference._id) ?
                  <>
                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                          <FormGroup dir="rtl" >
                            <Input type="select" name={i} /*value={candidatepreference.certjobpreferences[i].job}*/ onChange={handleChangecertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {certmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.jobtype.jobname + "/" + job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>)}
                    </Row>


                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - לא ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                          <FormGroup dir="rtl" >
                            <Input type="select" name={i} /*value={candidatepreference.noncertjobpreferences[i].job}*/ onChange={handleChangenoncertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {noncertmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.jobtype.jobname + "/" + job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>)}
                    </Row>
                  </>
                  : null}

                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn btn-primary" onClick={clickSubmit}>עדכן העדפות</button>
                </div>
              </Container>
            </CardBody>
          </Card>
        </Row>
      </Container>
      :
      <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>שלב המחזור לא תואם - לא ניתן להזין העדפה כרגע</CardTitle>
          </CardHeader>
        </Card>
      </Container>
  );
}
export default withRouter(CandidatePreferenceForm);;
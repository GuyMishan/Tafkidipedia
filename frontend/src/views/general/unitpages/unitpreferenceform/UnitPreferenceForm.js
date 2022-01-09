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
import soldier from "assets/img/soldier.png";

const UnitPreferenceForm = ({ match }) => {

  //mahzor data
  const [mahzorcandidates, setMahzorCandidates] = useState([]);
  const [job, setJob] = useState([]);
  //mahzor data

  //old-preference
  const [oldunitpreference, setOldunitPreference] = useState({})
  //old-preference

  //unitpreference data
  const [unitpreference, setUnitPreference] = useState({})
  //unitpreference data

  const isDuplicate = (data, obj) => {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].candidate._id == obj._id) {
        flag = true
      }
    }
    return flag;
  }

  const handleChangCandidatesOfPreference = event => {
    if (event.target.value != "בחר מועמד") {
      let tempcandidate = mahzorcandidates[event.target.value];
      let tempunitpreferencepreferencerankings = [...unitpreference.preferencerankings];

      if (!isDuplicate(tempunitpreferencepreferencerankings, tempcandidate)) {
        tempunitpreferencepreferencerankings.push({ candidate: tempcandidate, rank: 1 })
        setUnitPreference({ ...unitpreference, preferencerankings: tempunitpreferencepreferencerankings });
      }
    }
  }

  const handleChangePreferenceRank = event => {
    let temprank = parseInt(event.target.value);
    let tempindex = parseInt(event.target.name);

    let tempunitpreferencepreferencerankings = [...unitpreference.preferencerankings];
    tempunitpreferencepreferencerankings[tempindex].rank = temprank;
    setUnitPreference({ ...unitpreference, preferencerankings: tempunitpreferencepreferencerankings });
  }

  const loadmahzordata = async () => {
    //candidates
    let result1 = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${match.params.mahzorid}`)
    let candidates = result1.data;
    let tempmahzorcandidates = [];
    for (let i = 0; i < candidates.length; i++) {
      tempmahzorcandidates.push({ user: candidates[i].user, mahzor: candidates[i].mahzor._id, _id: candidates[i]._id })
    }
    setMahzorCandidates(tempmahzorcandidates);

    //jobs
    let result2 = await axios.get(`http://localhost:8000/api/jobbyid/${match.params.jobid}`)
    let job = result2.data[0];
    setJob(job);
  }

  const loadunitpreference = async () => {
    //users
    let result = await axios.get(`http://localhost:8000/api/users`)
    let users = result.data;
    //unitpreference
    let result1 = await axios.get(`http://localhost:8000/api/unitpreferencebyjobid/${match.params.jobid}`)
    let tempunitpreference = result1.data[0];

    if (tempunitpreference) //has unitprefernce to the job
    {
      for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempunitpreference.preferencerankings[i].candidate}`);
        tempunitpreference.preferencerankings[i].candidate = result1.data[0];
        delete tempunitpreference.preferencerankings[i].__v;
        delete tempunitpreference.preferencerankings[i]._id;
        delete tempunitpreference.preferencerankings[i].candidate.__v;
      }
      tempunitpreference.job = match.params.jobid;
      tempunitpreference.mahzor = match.params.mahzorid;
      setUnitPreference(tempunitpreference);

      let tempoldunitpreferencedata; //if has existing preference save the old one
      let oldresult = await axios.get(`http://localhost:8000/api/unitpreferencebyjobid/${match.params.jobid}`)
      tempoldunitpreferencedata = oldresult.data[0];
      setOldunitPreference(tempoldunitpreferencedata)
    }
    else { //doesnt has unitprefernce to the job
      setUnitPreference({ preferencerankings: [], job: match.params.jobid, mahzor: match.params.mahzorid })
    }
  }

  async function DeletePreferencerankingFromUnitPreference(preferenceranking) {
    let temppreferencerankings = await unitpreference.preferencerankings;
    temppreferencerankings = temppreferencerankings.filter(function (item) {
      return item !== preferenceranking
    })
    setUnitPreference({ ...unitpreference, preferencerankings: temppreferencerankings });
  }

  const clickSubmit = event => {
    if (unitpreference._id) {
      UpdateUnitPreferenceInDb();
    }
    else {
      AddUnitPreferenceToDb();
    }
  }

  async function AddUnitPreferenceToDb() {
    let tempunitpreference = unitpreference;
    //init preferencerankings candidates to only ids..
    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      tempunitpreference.preferencerankings[i].candidate = tempunitpreference.preferencerankings[i].candidate._id
    }

    //create all unit preferencerankings 
    let tempunitpreference_preferencerankings_ids = [];

    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      await axios.post(`http://localhost:8000/api/unitpreferenceranking`, tempunitpreference.preferencerankings[i])
        .then(res => {
          tempunitpreference_preferencerankings_ids.push(res.data._id)
        })
    }

    //create new unit preference
    tempunitpreference.preferencerankings = tempunitpreference_preferencerankings_ids;

    await axios.post(`http://localhost:8000/api/unitpreference`, tempunitpreference)
      .then(res => {
        toast.success("העדפה עודכנה בהצלחה")
        history.goBack();
      })
  }

  async function UpdateUnitPreferenceInDb() {
    let tempunitpreference = unitpreference;
    //init preferencerankings candidates to only ids..
    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      tempunitpreference.preferencerankings[i].candidate = tempunitpreference.preferencerankings[i].candidate._id
    }

    //delete all old unit preferencerankings 
   for (let i = 0; i < oldunitpreference.preferencerankings.length; i++) {
    await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${oldunitpreference.preferencerankings[i]._id}`)
      .then(res => {

      })
  }

    //create all unit preferencerankings 
    let tempunitpreference_preferencerankings_ids = [];

    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      await axios.post(`http://localhost:8000/api/unitpreferenceranking`, tempunitpreference.preferencerankings[i])
        .then(res => {
          tempunitpreference_preferencerankings_ids.push(res.data._id)
        })
    }

    //create new unit preference
    tempunitpreference.preferencerankings = tempunitpreference_preferencerankings_ids;

    await axios.put(`http://localhost:8000/api/unitpreference/${unitpreference._id}`, tempunitpreference)
      .then(res => {
        toast.success("העדפה עודכנה בהצלחה")
        history.goBack();
      })
  }

  async function init() {
    await loadunitpreference()
    loadmahzordata();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
      <Row>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס העדפות יחידה: {job.jobtype ? job.jobtype.jobname : null}</CardTitle>{/*headline*/}
          </CardHeader>

          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <Row>
                <Col xs={12} md={12}>
                  <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף מועמד</div>
                  <FormGroup dir="rtl" >
                    <Input type="select" onChange={handleChangCandidatesOfPreference}>
                      <option value={"בחר מועמד"}>בחר מועמד</option>
                      {mahzorcandidates.map((candidate, index) => (
                        <option key={index} value={index}>{candidate.user.name} {candidate.user.lastname}</option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                {unitpreference && unitpreference.preferencerankings ? unitpreference.preferencerankings.map((ranking, index) => (
                  <Col xs={12} md={4} key={index}>
                    <Row style={{ direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit' }}>
                      <Col xs={12} md={2} style={{ textAlign: 'center', alignSelf: 'center' }}>
                        <img src={soldier} alt="bookmark" style={{ height: "2rem" }} />
                      </Col>
                      <Col xs={12} md={4} style={{ alignSelf: 'center' }}>
                        <h5 style={{ textAlign: "right", margin: '0px' }}>{ranking.candidate.user.name} {ranking.candidate.user.lastname}</h5>
                      </Col>
                      <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                        <Input type="select" name={index} value={ranking.rank} onChange={handleChangePreferenceRank}>
                          <option value={"1"}>1</option>
                          <option value={"2"}>2</option>
                          <option value={"3"}>3</option>
                        </Input>
                      </Col>
                      <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                        <Button className="btn btn-danger" onClick={(e) => DeletePreferencerankingFromUnitPreference(ranking, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                      </Col>
                    </Row>
                  </Col>
                )) : null}
              </Row>

              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <button className="btn btn-primary" onClick={clickSubmit}>עדכן העדפות</button>
              </div>
            </Container>
          </CardBody>
        </Card>
      </Row>
    </Container>
  );
}
export default withRouter(UnitPreferenceForm);;
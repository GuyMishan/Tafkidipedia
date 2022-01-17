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

import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";
import MahzorDataComponent from './MahzorDataComponent';
import MahzorCandidates from './MahzorCandidates';
import MahzorJobs from './MahzorJobs';

const MahzorForm = ({ match }) => { //onsubmit moves to different page!!!!!!! (does error idk)
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  //mahzor

  //mahzor
  const [oldmahzordata, setOldmahzorData] = useState(undefined)
  //mahzor

  //candidates
  const [mahzororiginalcandidates, setMahzorOriginalCandidates] = useState([]);
  const [userstocandidate, setUsersToCandidate] = useState([]);

  const [users, setUsers] = useState([]);
  //candidates

  //jobs
  const [mahzororiginaljobs, setMahzorOriginalJobs] = useState([]);
  const [jobstoadd, setJobsToAdd] = useState([]);

  const [units, setUnits] = useState([]);
  const [jobtypes, setJobtypes] = useState([]);

  const [tempjobtoadd, setTempJobToAdd] = useState({});
  //jobs

  //modal
  const [isjobmodalopen, setIsJobModalOpen] = useState(false);
  //modal

  //candidates
  const [mahzoriosh, setMahzoriosh] = useState([]);
  //candidates

  //End Of Data!

  const TempJobToAddhandleChange = event => {
    if ((event.target.name == 'jobtype') || (event.target.name == 'unit')) {
      if (event.target.name == 'jobtype') {
        if ((event.target.value != "בחר סוג תפקיד")) {
          let tempjobtype = jobtypes[event.target.value];
          setTempJobToAdd({ ...tempjobtoadd, [event.target.name]: tempjobtype });
        }
        else {
          setTempJobToAdd({ ...tempjobtoadd, [event.target.name]: null });
        }
      }
      if (event.target.name == 'unit') {
        if ((event.target.value != "בחר יחידה")) {
          let tempunit = units[event.target.value];
          setTempJobToAdd({ ...tempjobtoadd, [event.target.name]: tempunit });
        }
        else {
          setTempJobToAdd({ ...tempjobtoadd, [event.target.name]: null });
        }
      }
    }
    else {
      const value = event.target.value;
      setTempJobToAdd({ ...tempjobtoadd, [event.target.name]: value });
    }
  }

  function handleChange(evt) {
    const value = evt.target.value;
    setMahzorData({ ...mahzordata, [evt.target.name]: value });
  }

  const isDuplicate = (data, obj) =>
    data.some((el) =>
      Object.entries(obj).every(([key, value]) => value === el[key])
    );

  const handleChangeUsersToCandidate = event => {
    if (event.target.value != "בחר מועמד") {
      let tempuser = users[event.target.value];
      if (!isDuplicate(userstocandidate, tempuser)) {
        setUsersToCandidate(userstocandidate => [...userstocandidate, tempuser]);
      }
    }
  }

  function DeleteUserFromUsersToCandidate(user) {
    let tempuserstocandidate = userstocandidate;
    tempuserstocandidate = tempuserstocandidate.filter(function (item) {
      return item !== user
    })
    setUsersToCandidate(tempuserstocandidate);
  }

  function OpenModal() {
    setTempJobToAdd({ unit: units[0], jobtype: jobtypes[0] });
    setIsJobModalOpen(true)
  }

  function AddJobToJobsToAdd() {
    if (CheckModalData()) {
      setJobsToAdd(jobstoadd => [...jobstoadd, tempjobtoadd]);
      setTempJobToAdd({});
      setIsJobModalOpen(false);
    }
    else {
      toast.error("שגיאה בטופס")
    }
  }

  function CheckModalClosing() {
    // if(CheckModalData())
    // {
    // setJobsToAdd(jobstoadd => [...jobstoadd, tempjobtoadd]);
    // setTempJobToAdd({});
    // setIsJobModalOpen(false)
    // }
    // else{
    //   toast.error("אין לסגור את הטופס כשהוא לא תקין- לסגירה יש להחזירו למצב הקודם")
    // }
    setTempJobToAdd({});
    setIsJobModalOpen(false)
  }

  function CheckModalData() {
    let flag = true;

    if (((tempjobtoadd.certain == "בחר ודאי/לא ודאי") || (!tempjobtoadd.certain))/* || ((tempjobtoadd.damah == 'בחר דמ"ח')||(!tempjobtoadd.damah))*/ ||
      ((tempjobtoadd.description == '') || (!tempjobtoadd.description)) || ((tempjobtoadd.jobtype == null) || (!tempjobtoadd.jobtype)) ||
      ((tempjobtoadd.location == '') || (!tempjobtoadd.location)) || ((tempjobtoadd.mahlaka == '') || (!tempjobtoadd.mahlaka)) ||
      ((tempjobtoadd.peilut == '') || (!tempjobtoadd.peilut)) || ((tempjobtoadd.sivug == "בחר סיווג") || (!tempjobtoadd.sivug)) ||
      ((tempjobtoadd.thom == '') || (!tempjobtoadd.thom)) || ((tempjobtoadd.unit == null) || (!tempjobtoadd.unit))) {
      flag = false;
    }
    return flag;
  }

  function DeleteJobFromJobsToAdd(job) {
    let tempjobstoadd = jobstoadd;
    tempjobstoadd = tempjobstoadd.filter(function (item) {
      return item !== job
    })
    setJobsToAdd(tempjobstoadd);
  }

  function PrepEditModal(job) {
    //DeleteJobFromJobsToAdd(job)
    setTempJobToAdd(job)
    setIsJobModalOpen(true);
  }

  const loadmahzor = () => {
    axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        tempmahzor.startdate = tempmahzor.startdate.slice(0, 10);
        tempmahzor.enddate = tempmahzor.enddate.slice(0, 10);
        setOldmahzorData(tempmahzor);
        setMahzorData(tempmahzor);
        loadcandidates(tempmahzor);
        loadjobs(tempmahzor);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadcandidates = async (tempmahzor) => {
    let tempusersfromcandidates = [];

    let result = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${tempmahzor._id}`)
    let candidates = result.data;

    for (let i = 0; i < candidates.length; i++) {
      let tempcandidate = candidates[i].user;
      tempcandidate.candidateid = candidates[i]._id
      tempusersfromcandidates.push(tempcandidate)
    }
    setUsersToCandidate(tempusersfromcandidates);
    setMahzorOriginalCandidates(tempusersfromcandidates)
  }

  const loadjobs = async (tempmahzor) => {
    let tempjobs = [];

    let result = await axios.get(`http://localhost:8000/api/jobsbymahzorid/${tempmahzor._id}`)
    let jobs = result.data;

    for (let i = 0; i < jobs.length; i++) {
      let tempjob = jobs[i];
      tempjobs.push(tempjob)
    }
    setJobsToAdd(tempjobs);
    setMahzorOriginalJobs(tempjobs)
  }

  const loadmahzoriosh = () => {
    axios.get(`http://localhost:8000/api/mahzoriosh`)
      .then(response => {
        setMahzoriosh(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadusers = () => {
    let candidaterole = '2'
    axios.get(`http://localhost:8000/api/usersbyrole/${candidaterole}`)
      .then(response => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadunits = () => {
    axios.get(`http://localhost:8000/api/unit`)
      .then(response => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadjobtypes = () => {
    axios.get(`http://localhost:8000/api/jobtype`)
      .then(response => {
        setJobtypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function init() {
    if (match.params.mahzorid != 0) {
      loadmahzor()
    }
    loadmahzoriosh();
    loadusers();
    loadunits();
    loadjobtypes();
  }

  const clickSubmit = event => {
    if (CheckFormData()) {
      SubmitData()
      toast.success("המחזור עודכן בהצלחה")
      history.goBack();
    }
    else {
      toast.error("שגיאה בטופס")
    }
  }

  function CheckFormData() {
    let flag = true;
    let error = "";

    if (((mahzordata.name == undefined) || (mahzordata.name == "")) || ((mahzordata.startdate == undefined) || (mahzordata.startdate == "")) || ((mahzordata.enddate == undefined) || (mahzordata.enddate == "")) || ((mahzordata.mahzoriosh == undefined) || (mahzordata.mahzoriosh == "")) || ((mahzordata.status == undefined) || (mahzordata.status == "")) || ((mahzordata.numberofjobpicks == undefined) || (mahzordata.numberofjobpicks == ""))) {
      error += "פרטים כלליים שגויים"
      flag = false;
    }
    return flag;
  }

  async function SubmitData() {
    // console.log("post")
    let tempmahzordata;
    if (match.params.mahzorid == 0) { //new mahzor
      let result = await axios.post("http://localhost:8000/api/mahzor", mahzordata);
      tempmahzordata = result.data;
    }
    else { // update mahzor
      let tempmahzorwithdeleteid = mahzordata;
      delete tempmahzorwithdeleteid._id;
      let result = await axios.put(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`, tempmahzorwithdeleteid);
      tempmahzordata = result.data;
    }

    //candidates
    let originalandnew = [];//to do nothing
    let originalandnotnew = [];//to delete
    let notoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginalcandidates.length; i++) {
      let flag = false;
      for (let j = 0; j < userstocandidate.length; j++) {
        if (mahzororiginalcandidates[i]._id == userstocandidate[j]._id) {
          flag = true;
        }
      }
      if (flag == true) {
        originalandnew.push(mahzororiginalcandidates[i])
      }
      else {
        originalandnotnew.push(mahzororiginalcandidates[i])
      }
    }

    for (let i = 0; i < userstocandidate.length; i++) {
      let flag = false;
      for (let j = 0; j < mahzororiginalcandidates.length; j++) {
        if (userstocandidate[i]._id == mahzororiginalcandidates[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        notoriginalandnew.push(userstocandidate[i])
      }
      else {
        //nothing
      }
    }
    // console.log("originalandnew")
    // console.log(originalandnew)
    // console.log("originalandnotnew")
    // console.log(originalandnotnew)
    // console.log("notoriginalandnew")
    // console.log(notoriginalandnew)

    for (let i = 0; i < notoriginalandnew.length; i++) { //add candidates thats no in db
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = notoriginalandnew[i]._id;
      let result = await axios.post(`http://localhost:8000/api/candidate`, tempcandidate);
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete candidates thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/candidate/${originalandnotnew[i].candidateid}`);
    }
    //candidates

    //jobs
    let jobsoriginalandnew = [];//to do nothing
    let jobsoriginalandnotnew = [];//to delete
    let jobsnotoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginaljobs.length; i++) {
      let flag = false;
      for (let j = 0; j < jobstoadd.length; j++) {
        if (mahzororiginaljobs[i]._id == jobstoadd[j]._id) {
          flag = true;
        }
      }
      if (flag == true) {
        jobsoriginalandnew.push(mahzororiginaljobs[i])
      }
      else {
        jobsoriginalandnotnew.push(mahzororiginaljobs[i])
      }
    }

    for (let i = 0; i < jobstoadd.length; i++) {
      let flag = false;
      for (let j = 0; j < mahzororiginaljobs.length; j++) {
        if (jobstoadd[i]._id == mahzororiginaljobs[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        jobsnotoriginalandnew.push(jobstoadd[i])
      }
      else {
        //nothing
      }
    }

    // console.log("jobsoriginalandnew")
    // console.log(jobsoriginalandnew)
    // console.log("jobsoriginalandnotnew")
    // console.log(jobsoriginalandnotnew)
    // console.log("jobsnotoriginalandnew")
    // console.log(jobsnotoriginalandnew)

    for (let i = 0; i < jobsnotoriginalandnew.length; i++) { //add jobs thats no in db
      let tempjob = jobsnotoriginalandnew[i];
      tempjob.mahzor = tempmahzordata._id;
      tempjob.jobtype = jobsnotoriginalandnew[i].jobtype._id;
      tempjob.unit = jobsnotoriginalandnew[i].unit._id;
      let result = await axios.post(`http://localhost:8000/api/job`, tempjob);
    }

    for (let i = 0; i < jobsoriginalandnotnew.length; i++) {//delete jobd thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/job/${jobsoriginalandnotnew[i]._id}`);
    }
    //jobs

  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Container style={{ direction: 'rtl' }}>
      <MahzorDataComponent mahzordata={mahzordata} oldmahzordata={oldmahzordata} mahzoriosh={mahzoriosh} handleChangeMahzorData={handleChange} />

      <MahzorCandidates mahzordata={mahzordata} handleChangeUsersToCandidate={handleChangeUsersToCandidate} users={users} userstocandidate={userstocandidate} DeleteUserFromUsersToCandidate={DeleteUserFromUsersToCandidate} />

      <MahzorJobs mahzordata={mahzordata} tempjobtoadd={tempjobtoadd} TempJobToAddhandleChange={TempJobToAddhandleChange} TempJobToAddhandleChange={TempJobToAddhandleChange} DeleteJobFromJobsToAdd={DeleteJobFromJobsToAdd} PrepEditModal={PrepEditModal} setIsJobModalOpen={setIsJobModalOpen} isjobmodalopen={isjobmodalopen} AddJobToJobsToAdd={AddJobToJobsToAdd} jobstoadd={jobstoadd} units={units} jobtypes={jobtypes} CheckModalClosing={CheckModalClosing} OpenModal={OpenModal} />

      <Button type="primary" onClick={() => clickSubmit()}>
        אישור
        </Button>
    </Container>
  );
}
export default withRouter(MahzorForm);;
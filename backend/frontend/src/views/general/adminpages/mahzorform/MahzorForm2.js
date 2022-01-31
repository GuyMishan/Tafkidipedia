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
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

import MahzorDataComponent from './MahzorDataComponent';
import MahzorCandidates2 from './MahzorCandidates2';
import MahzorJobs2 from './MahzorJobs2';

const MahzorForm2 = ({ match }) => { //onsubmit moves to different page!!!!!!! (does error idk)
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
  const [jobs, setJobs] = useState([]);
  //jobs

  //candidates
  const [mahzoriosh, setMahzoriosh] = useState([]);
  //candidates

  //End Of Data!
  
  const loadmahzor = () => {
    axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        setOldmahzorData(tempmahzor);
        setMahzorData(tempmahzor);
        loadcandidates(tempmahzor);
        loadjobsinmahzorbymahzor(tempmahzor);
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

  const loadjobsinmahzorbymahzor = async (tempmahzor) => {
    let tempjobsinmahzor = [];

    let result = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${tempmahzor._id}`)
    let jobsinmahzor = result.data;

    for (let i = 0; i < jobsinmahzor.length; i++) {
      let tempjobinmahzor = jobsinmahzor[i];
      tempjobsinmahzor.push(tempjobinmahzor.job)
    }
    setJobsToAdd(tempjobsinmahzor);
    setMahzorOriginalJobs(tempjobsinmahzor)
  }

  const loadjobs = async () => {
    let result = await axios.get(`http://localhost:8000/api/smartjobs`)
    let jobs = result.data;
    setJobs(jobs);
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

  function init() {
    if (match.params.mahzorid != 0) {
      loadmahzor()
    }
    loadmahzoriosh();
    loadusers();
    loadjobs();
  }
  
  useEffect(() => {
    init();
  }, [])

  function handleChange(evt) {
    const value = evt.target.value;
    setMahzorData({ ...mahzordata, [evt.target.name]: value });
  }

  const isDuplicate = (data, obj) =>
    data.some((el) =>
      Object.entries(obj).every(([key, value]) => value === el[key])
    );

    const isDuplicateid = (data, obj) =>{
      let flag=false;

      for(let i=0;i<data.length;i++)
      {
        if(data[i]._id==obj._id)
        {
          flag=true;
        }
      }
      return flag;
    // data.some((el) =>
    //   Object.entries(obj).every(([key, value]) => value._id === el[key]._id)
    // );    
  }


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

  function DeleteJobFromJobsToAdd(job) {
    let tempjobstoadd = jobstoadd;
    tempjobstoadd = tempjobstoadd.filter(function (item) {
      return item !== job
    })
    setJobsToAdd(tempjobstoadd);
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

    if (((mahzordata.name == undefined) || (mahzordata.name == "")) || ((mahzordata.year == undefined) || (mahzordata.year == "")) /*|| ((mahzordata.startdate == undefined) || (mahzordata.startdate == "")) || ((mahzordata.enddate == undefined) || (mahzordata.enddate == "")) */ || ((mahzordata.mahzoriosh == undefined) || (mahzordata.mahzoriosh == "")) || ((mahzordata.status == undefined) || (mahzordata.status == "")) || ((mahzordata.numberofjobpicks == undefined) || (mahzordata.numberofjobpicks == ""))) {
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
      let tempjobinmahzor = {};
      tempjobinmahzor.job=jobsnotoriginalandnew[i]._id;
      // let tempjobinmahzor = jobsnotoriginalandnew[i];
      tempjobinmahzor.mahzor = tempmahzordata._id;
      // tempjobinmahzor.unit = jobsnotoriginalandnew[i].unit._id;
      let result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
    }

    let result = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${tempmahzordata._id}`)
    let jobsinmahzor = result.data;

    for (let i = 0; i < jobsoriginalandnotnew.length; i++) {//delete jobd thats in db and unwanted
      // let result = await axios.delete(`http://localhost:8000/api/jobinmahzor/${jobsoriginalandnotnew[i]._id}`);
      for (let j = 0; j < jobsinmahzor.length; j++) {//delete jobd thats in db and unwanted
        console.log(jobsoriginalandnotnew[i])
        console.log(jobsinmahzor[j])
        if(jobsoriginalandnotnew[i]._id==jobsinmahzor[j].job._id)
        await axios.delete(`http://localhost:8000/api/jobinmahzor/${jobsinmahzor[j]._id}`);
      }
    }
    //jobs

  }

  //newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww// candidates

  var fileInput = React.createRef();

  const [state, setState] = useState({
    isOpen: false,
    dataLoaded: false,
    isFormInvalid: false,
    rows: null,
    cols: null
  })

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        setState({
          dataLoaded: true,
          cols: resp.cols,
          rows: resp.rows
        });
      }
    });
  }

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        renderFile(fileObj)
      }
      else {
        setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }

  const openFileBrowser = () => {
    fileInput.current.click();
  }

  async function CalculateUsersAccordingToExcel() {
    //if table isnt empty..
    if (state.rows != null) {
      let tableheaders = state.rows[0];

      let tablebody = [];
      let temptablebody = state.rows;
      temptablebody.splice(0, 1)//deletes headers

      for (let k = 0; k < temptablebody.length; k++) {
        tablebody[k] = {};
        for (let l = 0; l < tableheaders.length; l++) {
          let a = tableheaders[l];
          tablebody[k][a] = temptablebody[k][l];
        }
      }

      for (let i = 0; i < tablebody.length; i++) {
        tablebody[i].personalnumber = 's' + await tablebody[i].personalnumber;
      }

      // console.log("headers:")
      // console.log(tableheaders)
      // console.log("body:")
      // console.log(tablebody)

      //end of data

      //get all users
      let response = await axios.get(`http://localhost:8000/api/users`)
      let tempusers = response.data;

      let tempusersfromcandidates = userstocandidate.slice();

      for (let i = 0; i < tempusers.length; i++) {
        let flag = false;
        for (let j = 0; j < tablebody.length; j++) {
          if (tempusers[i].personalnumber == tablebody[j].personalnumber) {
            flag = true
          }
        }
        if (flag) {
          let flag2 = false;
          for (let k = 0; k < userstocandidate.length; k++) {
            if (userstocandidate[k]._id == tempusers[i]._id) {
              flag2 = true
            }
          }
          if (!flag2) {
            tempusersfromcandidates.push(tempusers[i])
          }
        }
      }

      setUsersToCandidate(tempusersfromcandidates);
    }
  }

  useEffect(() => {
    CalculateUsersAccordingToExcel();
  }, [state.cols])

  //newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww// jobs

  var fileInput2 = React.createRef();

  const [state2, setState2] = useState({
    isOpen: false,
    dataLoaded: false,
    isFormInvalid: false,
    rows: null,
    cols: null
  })

  const renderFile2 = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        setState2({
          dataLoaded: true,
          cols: resp.cols,
          rows: resp.rows
        });
      }
    });
  }

  const fileHandler2 = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        setState2({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        renderFile2(fileObj)
      }
      else {
        setState2({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }

  const openFileBrowser2 = () => {
    fileInput2.current.click();
  }

  async function CalculateJobsAccordingToExcel() {
    //if table isnt empty..
    if (state2.rows != null) {
      let tableheaders = state2.rows[0];

      let tablebody = [];
      let temptablebody = state2.rows;
      temptablebody.splice(0, 1)//deletes headers

      for (let k = 0; k < temptablebody.length; k++) {
        tablebody[k] = {};
        for (let l = 0; l < tableheaders.length; l++) {
          let a = tableheaders[l];
          tablebody[k][a] = temptablebody[k][l];
        }
      }

      // console.log("headers:")
      // console.log(tableheaders)
      // console.log("body:")
      // console.log(tablebody)

      //end of data

      //get all jobs
      let response = await axios.get(`http://localhost:8000/api/smartjobs`)
      let tempjobs = response.data;

      let tempjobstoadd = jobstoadd.slice();

      for (let i = 0; i < tempjobs.length; i++) {
        let flag = false;
        for (let j = 0; j < tablebody.length; j++) {
          if (tempjobs[i].jobcode == tablebody[j].jobcode) {
            flag = true
          }
        }
        if (flag) {
          let flag2 = false;
          for (let k = 0; k < jobstoadd.length; k++) {
            if (jobstoadd[k]._id == tempjobs[i]._id) {
              flag2 = true
            }
          }
          if (!flag2) {
            tempjobstoadd.push(tempjobs[i])
          }
        }
      }

      setJobsToAdd(tempjobstoadd);
    }
  }

  useEffect(() => {
    CalculateJobsAccordingToExcel();
  }, [state2.cols])

  const AddJobToJobsToAdd2 = event => {
    if ((event.target.value != "בחר תפקיד")) {
      let tempjob = jobs[event.target.value];
      if (!isDuplicateid(jobstoadd, tempjob)) {
        setJobsToAdd(jobstoadd => [...jobstoadd, tempjob]);
      }
    }
  }

  return (
    <Container style={{ direction: 'rtl' }}>
      <MahzorDataComponent mahzordata={mahzordata} oldmahzordata={oldmahzordata} mahzoriosh={mahzoriosh} handleChangeMahzorData={handleChange} />

      <MahzorCandidates2 mahzordata={mahzordata} users={users} userstocandidate={userstocandidate} handleChangeUsersToCandidate={handleChangeUsersToCandidate} DeleteUserFromUsersToCandidate={DeleteUserFromUsersToCandidate} openFileBrowser={openFileBrowser} fileHandler={fileHandler} fileInput={fileInput} state={state} />

      <MahzorJobs2 mahzordata={mahzordata} jobs={jobs} jobstoadd={jobstoadd} DeleteJobFromJobsToAdd={DeleteJobFromJobsToAdd} AddJobToJobsToAdd={AddJobToJobsToAdd2} openFileBrowser={openFileBrowser2} fileHandler={fileHandler2} fileInput={fileInput2} state={state2} />

      <Button type="primary" onClick={() => clickSubmit()}>
        אישור
      </Button>
    </Container>
  );
}
export default withRouter(MahzorForm2);;
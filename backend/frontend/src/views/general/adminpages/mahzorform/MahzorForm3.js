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

import MahzorDataComponent from './MahzorDataComponent3';
import MahzorCandidates3 from './MahzorCandidates3';

const MahzorForm3 = ({ match }) => { //onsubmit moves to different page!!!!!!! (does error idk)
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  //mahzor

  //mahzor
  const [oldmahzordata, setOldmahzorData] = useState(undefined)
  //mahzor

  //candidates
  const [mahzororiginalcandidates, setMahzorOriginalCandidates] = useState([]);
  const [users, setUsers] = useState([]); //users to candidate
  //candidates

  //jobs
  // const [mahzororiginaljobs, setMahzorOriginalJobs] = useState([]);
  // const [jobs, setJobs] = useState([]);//jobs to add
  //jobs

  //new
  const [population, setPopulation] = useState([]);
  const [movement, setMovement] = useState([]);
  //new

  //End Of Data!

  const loadmahzor = () => {
    axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        setOldmahzorData(tempmahzor);
        setMahzorData(tempmahzor);
        loadcandidates(tempmahzor);
        // loadjobsinmahzorbymahzor(tempmahzor);
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
      tempcandidate.movement = candidates[i].movement
      tempusersfromcandidates.push(tempcandidate)
    }
    setUsers(tempusersfromcandidates);
    setMahzorOriginalCandidates(tempusersfromcandidates)
  }

  const IsjobCertainByUserMovement = (usermovement) => {
    for (let i = 0; i < movement.length; i++) {
      if (movement[i]._id == usermovement) {
        if ((movement[i].name == 'רוחב') || (movement[i].name == 'רוחב לקידום/רוחב') || (movement[i].name == 'שחרור') || (movement[i].name == 'פרישה')) {
          return "ודאי";
        }
        if ((movement[i].name == 'ממשיך/רוחב') || (movement[i].name == 'רוחב לקידום/ממשיך') || (movement[i].name == 'רוחב לקידום/ממשיך/רוחב')) {
          return "אופציה";
        }
        if ((movement[i].name == 'ממשיך')) {
          return "לא נפתח";
        }
      }
    }
  }

  const loadpopulation = () => {
    axios.get(`http://localhost:8000/api/population`)
      .then(response => {
        setPopulation(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadmovement = async () => {
    await axios.get(`http://localhost:8000/api/movement`)
      .then(response => {
        setMovement(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadusersbypopulation = (population) => {
    let candidaterole = '2'
    axios.get(`http://localhost:8000/api/usersbyroleandpopulation/${candidaterole}/${population}`)
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].movement = movement[0]._id
        }
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
    loadmovement();
    loadpopulation();
  }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    if (mahzordata.population != undefined)
      loadusersbypopulation(mahzordata.population);
  }, [mahzordata.population])

  function handleChangeMahzorData(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      setMahzorData({ ...mahzordata, [evt.target.name]: value });
  }

  function handleChangeUser(evt) {
    const namevalue = evt.target.name; //index of user in user arr
    const value = evt.target.value; //id of movement

    let tempusers = [...users];
    let tempuser = { ...tempusers[namevalue] };
    tempuser.movement = value;
    tempusers[namevalue] = tempuser;
    setUsers(tempusers);
  }

  const clickSubmit = event => {
    if (CheckFormData()) {
      SubmitData()
      toast.success("המחזור עודכן בהצלחה")
      // history.goBack(); //makes a bug. push to url also doesnt work..
      history.push(`/mahzorimpage`);
    }
    else {
      toast.error("שגיאה בטופס")
    }
  }

  function CheckFormData() {
    let flag = true;
    let error = "";

    if (((mahzordata.population == undefined) || (mahzordata.population == "")) || ((mahzordata.season == undefined) || (mahzordata.season == "")) || ((mahzordata.status == undefined) || (mahzordata.status == "")) || ((mahzordata.numberofjobpicks == undefined) || (mahzordata.numberofjobpicks == ""))) {
      error += "פרטים כלליים שגויים"
      flag = false;
    }
    return flag;
  }

  async function SubmitData() {
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
    let originalandnewchanged = [];//to update
    let originalandnotnew = [];//to delete
    let notoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginalcandidates.length; i++) {
      let flag = false;
      let movementchangeflag = -1;
      for (let j = 0; j < users.length; j++) {
        if (mahzororiginalcandidates[i]._id == users[j]._id) {
          flag = true;
          if (mahzororiginalcandidates[i].movement != users[j].movement) {
            movementchangeflag = j;
          }
        }
      }
      if (flag == true) {
        if (movementchangeflag != -1) {
          let tempcandidate = { ...users[movementchangeflag] }
          tempcandidate.candidateid = mahzororiginalcandidates[i].candidateid
          originalandnewchanged.push(tempcandidate)
        }
        else {
          originalandnew.push(mahzororiginalcandidates[i])
        }
      }
      else {
        originalandnotnew.push(mahzororiginalcandidates[i])
      }
    }

    for (let i = 0; i < users.length; i++) {
      let flag = false;
      for (let j = 0; j < mahzororiginalcandidates.length; j++) {
        if (users[i]._id == mahzororiginalcandidates[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        notoriginalandnew.push(users[i])
      }
      else {
        //nothing
      }
    }
    console.log("originalandnew")
    console.log(originalandnew)
    console.log("originalandnewchanged")
    console.log(originalandnewchanged)
    console.log("originalandnotnew")
    console.log(originalandnotnew)
    console.log("notoriginalandnew")
    console.log(notoriginalandnew)

    //originalandnew to do nothing

    for (let i = 0; i < originalandnewchanged.length; i++) { //update candidates thats in db but changed
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = originalandnewchanged[i]._id;
      tempcandidate.movement = originalandnewchanged[i].movement;
      let result = await axios.put(`http://localhost:8000/api/candidate/${originalandnewchanged[i].candidateid}`, tempcandidate);
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add candidates thats no in db
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = notoriginalandnew[i]._id;
      tempcandidate.movement = notoriginalandnew[i].movement;
      let result = await axios.post(`http://localhost:8000/api/candidate`, tempcandidate);
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete candidates thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/candidate/${originalandnotnew[i].candidateid}`);
    }
    //candidates

    //jobs

    //originalandnew to do nothing

    for (let i = 0; i < originalandnewchanged.length; i++) { //update jobinmahzors thats in db but changed
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = originalandnewchanged[i].job;
      tempjobinmahzor.certain = IsjobCertainByUserMovement(originalandnewchanged[i].movement);
      let result;

      if (tempjobinmahzor.certain != 'לא נפתח') {
        result = await axios.put(`http://localhost:8000/api/updatejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`, tempjobinmahzor);

        if (result.data.nModified == 0) // ממשיך -> ודאי/אופציה
        {
          result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);//create jobinmahzor
          if (mahzordata.status >= 3)//check status of mahzor  
          {
            let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
            let tempeshkolbymahzorid = response.data;
            if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
            {
              let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
              let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
            }
            if (mahzordata.status >= 5)//check status of mahzor  
            {
              let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
              let tempeshkolbymahzorid = response.data;
              if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
              {
                let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
              }
            }
          }
        }
        else // אופציה -> ודאי / ודאי -> אופציה
        {
          //?????????
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
        let tempjobinmahzortodelete = result1.data[0];
        //delete jobinmahzor
        let result2 = await axios.delete(`http://localhost:8000/api/deletejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);

        //delete candidatepreferences + candidateprefrankings related to jobinmahzor
        let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;

        for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
          let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[i].certjobpreferences;
          let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[i].noncertjobpreferences;

          for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
            if (result4.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4._id}`);
              tempcandidatespreference_cerjobprefs.splice(j, 1)
            }
          }

          for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
            if (result4.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4._id}`);
              tempcandidatespreference_noncerjobprefs.splice(j, 1)
            }
          }
          let tempcandidatespreference = tempcandidatespreferencesdata[i];
          let tempcandidatespreference_id = tempcandidatespreference._id;
          tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
          tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
          delete tempcandidatespreference._id;
          let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`);

          //delete candidate which his job is deleted preference + rankings
          if (tempcandidatespreferencesdata[i].candidate == originalandnewchanged[i].candidateid) {
            for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
              //delete preferenceranking
              let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
            }
            for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
              //delete preferenceranking
              let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
            }
            let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`);
          }
        }

        //delete eshkol of jobinmahzor +delete candidatesineshkol of eshkol based on mahzor stage..
        if (mahzordata.status >= 3) {
          let response = await axios.get(`http://localhost:8000/api/eshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
          let tempeshkolbyjobinmahzorid = response.data[0];
          if (tempeshkolbyjobinmahzorid != null)//check if eshkol exists
          {
            if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
              for (let j = 0; j < tempeshkolbyjobinmahzorid.candidatesineshkol.length; j++) {
                //delete candidatesineshkol
                let result9 = await axios.delete(`http://localhost:8000/api/candidatesineshkol/${tempeshkolbyjobinmahzorid.candidatesineshkol[j]}`);
              }
            }
            let result10 = await axios.delete(`http://localhost:8000/api/eshkol/${tempeshkolbyjobinmahzorid._id}`);
          }
          if (mahzordata.status >= 5) {
            let response = await axios.get(`http://localhost:8000/api/finaleshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
            let tempfinaleshkolbyjobinmahzorid = response.data;
            if (tempfinaleshkolbyjobinmahzorid != null)//check if finaleshkol exists
            {
              if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
                for (let j = 0; j < tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol.length; j++) {
                  //delete candidatesinfinaleshkol
                  let result11 = await axios.delete(`http://localhost:8000/api/candidatesinfinaleshkol/${tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol[j]}`);
                }
              }
              let result12 = await axios.delete(`http://localhost:8000/api/finaleshkol/${tempfinaleshkolbyjobinmahzorid._id}`);
            }
          }
        }
        //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!

      }
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add jobinmahzors thats no in db
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = notoriginalandnew[i].job;
      tempjobinmahzor.certain = IsjobCertainByUserMovement(notoriginalandnew[i].movement);
      let result;
      if (tempjobinmahzor.certain != 'לא נפתח')
        result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete jobinmahzors thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/deletjobinmahzorbyjobidandmahzorid/${originalandnotnew[i].job}/${tempmahzordata._id}`);
    }
    //jobs
  }

  return (
    <Container style={{ direction: 'rtl' }}>
      <MahzorDataComponent mahzordata={mahzordata} oldmahzordata={oldmahzordata} population={population} handleChangeMahzorData={handleChangeMahzorData} />

      <MahzorCandidates3 mahzordata={mahzordata} users={users} movement={movement} handleChangeUser={handleChangeUser} />

      <Button type="primary" onClick={() => clickSubmit()}>
        אישור
      </Button>
    </Container>
  );
}
export default withRouter(MahzorForm3);;
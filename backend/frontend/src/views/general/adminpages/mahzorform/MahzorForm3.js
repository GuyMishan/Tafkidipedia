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
    // console.log("originalandnew")
    // console.log(originalandnew)
    // console.log("originalandnewchanged")
    // console.log(originalandnewchanged)
    // console.log("originalandnotnew")
    // console.log(originalandnotnew)
    // console.log("notoriginalandnew")
    // console.log(notoriginalandnew)

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
        //try to update jobinmahzor
        result = await axios.put(`http://localhost:8000/api/updatejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`, tempjobinmahzor);

        if (result.data.nModified == 0) // ממשיך -> ודאי/אופציה
        {
          //create jobinmahzor
          result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
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
          //get updated jobinmahzor
          let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
          let tempupdatedjobinmahzor = result1.data[0];
          // console.log(tempupdatedjobinmahzor)

          if (mahzordata.status < 5) {
            //update candidatepreferences related to jobinmahzor
            let response17 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempcandidatespreferencestoupdate = response17.data;

            for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
              let ischangedcandidatepreference = false;
              let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

              if (tempupdatedjobinmahzor.certain == 'ודאי') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                    tempcandidatespreference_noncerjobprefs.splice(k, 1);
                    tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                    ischangedcandidatepreference = true;

                  }
                }
              }
              if (tempupdatedjobinmahzor.certain == 'אופציה') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                    tempcandidatespreference_cerjobprefs.splice(k, 1);
                    tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                    ischangedcandidatepreference = true;
                  }
                }
              }

              if (ischangedcandidatepreference) {
                //fix rankings ranks......
                let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                let tempcandidatespreference_id = tempcandidatespreference._id;
                tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                delete tempcandidatespreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
              }
            }
            if (mahzordata.status >= 5) {
              //update candidatepreferences related to jobinmahzor
              let response17 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencestoupdate = response17.data;

              for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
                let ischangedcandidatepreference = false;
                let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
                let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

                if (tempupdatedjobinmahzor.certain == 'ודאי') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                      tempcandidatespreference_noncerjobprefs.splice(k, 1);
                      tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                      ischangedcandidatepreference = true;

                    }
                  }
                }
                if (tempupdatedjobinmahzor.certain == 'אופציה') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                      tempcandidatespreference_cerjobprefs.splice(k, 1);
                      tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                      ischangedcandidatepreference = true;
                    }
                  }
                }

                if (ischangedcandidatepreference) {
                  //fix rankings ranks......
                  let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                  let tempcandidatespreference_id = tempcandidatespreference._id;
                  tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                  tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                  for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  delete tempcandidatespreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
                }
              }
            }
          }
          //update eshkols and candidatesineshkols??!!
          //?????????
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        //get jobinmahzor to delete
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
        let tempjobinmahzortodelete = result1.data[0];

        //delete candidatepreferences + candidateprefrankings related to jobinmahzor
        let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;

        for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
          let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[j].certjobpreferences;
          let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[j].noncertjobpreferences;

          for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_cerjobprefs.splice(k, 1)
            }
          }

          for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_noncerjobprefs.splice(k, 1)
            }
          }
          let tempcandidatespreference = tempcandidatespreferencesdata[j];
          let tempcandidatespreference_id = tempcandidatespreference._id;
          tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
          tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
          delete tempcandidatespreference._id;
          let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);

          //delete candidatepreference of candidate which his job is deleted  + rankings
          if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
            for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
              //delete preferenceranking
              let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
            }
            for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
              //delete preferenceranking
              let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
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
                let result9 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbyjobinmahzorid.candidatesineshkol[j]}`);
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
                  let result11 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol[j]}`);
                }
              }
              let result12 = await axios.delete(`http://localhost:8000/api/finaleshkol/${tempfinaleshkolbyjobinmahzorid._id}`);
            }
          }
        }

        //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
        if (mahzordata.status >= 3) {
          let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
          let tempeshkolbymahzorid = response.data;

          for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
            let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
            for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
              if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
              }
            }
            if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
              let tempeshkoltoupdate = tempeshkolbymahzorid[j];
              let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
              tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
              delete tempeshkoltoupdate._id;
              let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
            }
          }
          if (mahzordata.status >= 5) {
            let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
            let tempeshkolbymahzorid = response.data;

            for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
              let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
              for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                  let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                  tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                }
              }
              if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                delete tempeshkoltoupdate._id;
                let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
              }
            }
          }
        }

        //delete unitpreference + rankings related to candidate
        if (mahzordata.status >= 3) {
          let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
          let tempunitpreferencesdata = response7.data;

          for (let j = 0; j < tempunitpreferencesdata.length; j++) {
            //delete candidatepreferences + candidateprefrankings related to jobinmahzor
            let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

            for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
              let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
              if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                tempunitpreference_preferencerankings.splice(k, 1)
              }
            }

            let tempunitpreference = tempunitpreferencesdata[j];
            let tempunitpreference_id = tempunitpreference._id;
            tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
            delete tempunitpreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);

            //delete unitpreference + rankings of jobinmahzor
            if (tempunitpreferencesdata[j].jobinmahzor._id == tempjobinmahzortodelete._id) {
              for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                //delete preferenceranking
                let result7 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
              }
              let result8 = await axios.delete(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`);
            }
          }
          if (mahzordata.status >= 5) {
            let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
            let tempunitpreferencesdata = response7.data;

            for (let j = 0; j < tempunitpreferencesdata.length; j++) {
              //delete candidatepreferences + candidateprefrankings related to jobinmahzor
              let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

              for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                  let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                  tempunitpreference_preferencerankings.splice(k, 1)
                }
              }

              let tempunitpreference = tempunitpreferencesdata[j];
              let tempunitpreference_id = tempunitpreference._id;
              tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
              delete tempunitpreference._id;
              let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);

              //delete unitpreference + rankings of jobinmahzor
              if (tempunitpreferencesdata[j].jobinmahzor._id == tempjobinmahzortodelete._id) {
                for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                }
                let result8 = await axios.delete(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`);
              }
            }
          }
        }

        //delete jobinmahzor
        let result2 = await axios.delete(`http://localhost:8000/api/deletejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
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
    
    if (mahzordata.status >= 3) {
    await CalculateUpdateMahzorEshkol();
    if (mahzordata.status >= 5) {
      await CalculateUpdateMahzorFinalEshkol();
      }
    }
  }

  async function CalculateUpdateMahzorEshkol() {
    //delete all candidatesineshkol that not added from Admin + update
    let response22 = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
    let temptesteshkolbymahzorid = response22.data;
    let tempeshkolbymahzorid = [];

    for (let j = 0; j < temptesteshkolbymahzorid.length; j++) {
      tempeshkolbymahzorid[j] = { ...temptesteshkolbymahzorid[j] }
      tempeshkolbymahzorid[j].candidatesineshkol = [];
      tempeshkolbymahzorid[j].jobinmahzor =  tempeshkolbymahzorid[j].jobinmahzor._id;
      tempeshkolbymahzorid[j].mahzor =  tempeshkolbymahzorid[j].mahzor._id;
      for (let k = 0; k < temptesteshkolbymahzorid[j].candidatesineshkol.length; k++) {
        //  if candidatesineshkol is not admin inserted -> delete it.
        if (!((temptesteshkolbymahzorid[j].candidatesineshkol[k].candidaterank) || (temptesteshkolbymahzorid[j].candidatesineshkol[k].unitrank))) {
          tempeshkolbymahzorid[j].candidatesineshkol.push({ ...temptesteshkolbymahzorid[j].candidatesineshkol[k] })
        }
        else {
          let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${temptesteshkolbymahzorid[j].candidatesineshkol[k]._id}`);
        }
      }
    }
    // console.log("eshkols with only admin added prefs")
    // console.log(tempeshkolbymahzorid)

    //get all jobs of mahzor
    let response2 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempmahzorjobs = response2.data;
    // console.log(tempmahzorjobs)

    //get all candidatepreferences of mahzor
    let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
    let tempcandidatespreferencesdata = response3.data;
    for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
      for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
      }
      for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
      }
    }
    //  console.log(tempcandidatespreferencesdata)

    //get all unitpreferences of mahzor
    let response4 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
    let tempunitspreferences = response4.data;
    //  console.log(tempunitspreferences)

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      //calculate eshkols candidate preferences 
      for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
        for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].certjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
          }
        }
        for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
          }
        }
      }

      //calculate eshkols unit preferences 
      for (let l = 0; l < tempunitspreferences.length; l++) {
        if (tempunitspreferences[l].jobinmahzor._id == tempeshkolbymahzorid[i].jobinmahzor) {
          for (let m = 0; m < tempunitspreferences[l].preferencerankings.length; m++) {
            let flag = false;  //flag = is candidate exists in certain eshkol 
            for (let n = 0; n < tempeshkolbymahzorid[i].candidatesineshkol.length; n++) {
              if (tempeshkolbymahzorid[i].candidatesineshkol[n].candidate == tempunitspreferences[l].preferencerankings[m].candidate) {
                flag = true;
                tempeshkolbymahzorid[i].candidatesineshkol[n].unitrank = tempunitspreferences[l].preferencerankings[m].rank;
              }
            }
            if (flag == false) {
              tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempunitspreferences[l].preferencerankings[m].candidate, unitrank: tempunitspreferences[l].preferencerankings[m].rank })
            }
          }
        }
      }
    }
    // console.log("eshkols with admin prefs + calculated prefs:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols candidatesineshkol to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        if ((tempeshkolbymahzorid[i].candidatesineshkol[j].candidaterank) || (tempeshkolbymahzorid[i].candidatesineshkol[j].unitrank)) {
          let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempeshkolbymahzorid[i].candidatesineshkol[j])
          let tempdata = response1.data;
          tempeshkolbymahzorid[i].candidatesineshkol[j] = tempdata._id
        }
      }
    }
    // console.log("eshkols with admin prefs + calculated prefs ids:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      let tempeshkolbymahzorid_id=tempeshkolbymahzorid[i]._id;
      delete tempeshkolbymahzorid[i]._id;
      let response1 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkolbymahzorid_id}`, tempeshkolbymahzorid[i])
      // let tempdata = response1.data;
    }
  }

  async function CalculateUpdateMahzorFinalEshkol() {
    //delete all candidatesineshkol that not added from Admin + update
    let response22 = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
    let temptesteshkolbymahzorid = response22.data;
    let tempeshkolbymahzorid = [];

    for (let j = 0; j < temptesteshkolbymahzorid.length; j++) {
      tempeshkolbymahzorid[j] = { ...temptesteshkolbymahzorid[j] }
      tempeshkolbymahzorid[j].candidatesineshkol = [];
      tempeshkolbymahzorid[j].jobinmahzor =  tempeshkolbymahzorid[j].jobinmahzor._id;
      tempeshkolbymahzorid[j].mahzor =  tempeshkolbymahzorid[j].mahzor._id;
      for (let k = 0; k < temptesteshkolbymahzorid[j].candidatesineshkol.length; k++) {
        //  if candidatesineshkol is not admin inserted -> delete it.
        if (!((temptesteshkolbymahzorid[j].candidatesineshkol[k].candidaterank) || (temptesteshkolbymahzorid[j].candidatesineshkol[k].unitrank))) {
          tempeshkolbymahzorid[j].candidatesineshkol.push({ ...temptesteshkolbymahzorid[j].candidatesineshkol[k] })
        }
        else {
          let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${temptesteshkolbymahzorid[j].candidatesineshkol[k]._id}`);
        }
      }
    }
    // console.log("finaleshkols with only admin added prefs")
    // console.log(tempeshkolbymahzorid)

    //get all jobs of mahzor
    let response2 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempmahzorjobs = response2.data;
    // console.log(tempmahzorjobs)

    //get all candidatepreferences of mahzor
    let response3 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
    let tempcandidatespreferencesdata = response3.data;
    for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
      for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
      }
      for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
      }
    }
    //  console.log(tempcandidatespreferencesdata)

    //get all unitpreferences of mahzor
    let response4 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
    let tempunitspreferences = response4.data;
    //  console.log(tempunitspreferences)

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      //calculate eshkols candidate preferences 
      for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
        for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].certjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
          }
        }
        for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
          }
        }
      }

      //calculate eshkols unit preferences 
      for (let l = 0; l < tempunitspreferences.length; l++) {
        if (tempunitspreferences[l].jobinmahzor._id == tempeshkolbymahzorid[i].jobinmahzor) {
          for (let m = 0; m < tempunitspreferences[l].preferencerankings.length; m++) {
            let flag = false;  //flag = is candidate exists in certain eshkol 
            for (let n = 0; n < tempeshkolbymahzorid[i].candidatesineshkol.length; n++) {
              if (tempeshkolbymahzorid[i].candidatesineshkol[n].candidate == tempunitspreferences[l].preferencerankings[m].candidate) {
                flag = true;
                tempeshkolbymahzorid[i].candidatesineshkol[n].unitrank = tempunitspreferences[l].preferencerankings[m].rank;
              }
            }
            if (flag == false) {
              tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempunitspreferences[l].preferencerankings[m].candidate, unitrank: tempunitspreferences[l].preferencerankings[m].rank })
            }
          }
        }
      }
    }
    // console.log("finaleshkols with admin prefs + calculated prefs:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols candidatesineshkol to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        if ((tempeshkolbymahzorid[i].candidatesineshkol[j].candidaterank) || (tempeshkolbymahzorid[i].candidatesineshkol[j].unitrank)) {
          let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempeshkolbymahzorid[i].candidatesineshkol[j])
          let tempdata = response1.data;
          tempeshkolbymahzorid[i].candidatesineshkol[j] = tempdata._id
        }
      }
    }
    // console.log("finaleshkols with admin prefs + calculated prefs ids:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      let tempeshkolbymahzorid_id=tempeshkolbymahzorid[i]._id;
      delete tempeshkolbymahzorid[i]._id;
      let response1 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkolbymahzorid_id}`, tempeshkolbymahzorid[i])
      // let tempdata = response1.data;
    }
  }

  return (
    <div style={{ direction: 'rtl' }}>
      <MahzorDataComponent mahzordata={mahzordata} oldmahzordata={oldmahzordata} population={population} handleChangeMahzorData={handleChangeMahzorData} />

      <MahzorCandidates3 mahzordata={mahzordata} users={users} movement={movement} handleChangeUser={handleChangeUser} />

      <Button type="primary" onClick={() => clickSubmit()}>
        אישור
      </Button>
    </div>
  );
}
export default withRouter(MahzorForm3);;
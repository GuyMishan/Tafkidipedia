import React, { useState, useEffect } from 'react';
import { withRouter, Redirect } from "react-router-dom";

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
import ToggleButton from "react-toggle-button";
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

const EditUserForm = ({ match }) => {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    personalnumber: "",
    password: "",
    role: "",
    unitid: "",
    migzar: "",
    gender: "",
    cellphone: "",
    rank: "",
  });

  const [units, setUnits] = useState([]);

  const [populations, setPopulations] = useState([]);

  const [jobs, setJobs] = useState([]);

  const loadUnits = () => {
    axios
      .get("http://localhost:8000/api/unit")
      .then((response) => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadPopulations = () => {
    axios
      .get("http://localhost:8000/api/population")
      .then((response) => {
        setPopulations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadJobs = () => {
    axios
      .get("http://localhost:8000/api/smartjobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      setData({ ...data, [evt.target.name]: value });
  }

  const clickSubmit = (event) => {
    CheckSignUpForm(event);
  };

  const CheckSignUpForm = (event) => {
    event.preventDefault();
    var flag = true;
    var ErrorReason = "";
    if (data.name == "") {
      flag = false;
      ErrorReason += "שם ריק \n";
    }
    if (data.lastname == "") {
      flag = false;
      ErrorReason += "שם משפחה ריק \n";
    }
    if (data.personalnumber == "") {
      flag = false;
      ErrorReason += "מס אישי ריק \n";
    }
    if (data.password == "") {
      flag = false;
      ErrorReason += "סיסמא ריקה \n";
    }
    if (data.role == "") {
      flag = false;
      ErrorReason += "הרשאה ריקה \n";
    } else {
      if (data.role === "0") {

      }
      if (data.role === "1") {
        if (data.unitid === "") {
          flag = false;
          ErrorReason += "יחידה ריקה \n";
        }
      }
    }

    if (flag == true) {
      FixUser(event);
    } else {
      toast.error(ErrorReason);
    }
  };

  const FixUser = (event) => {
    event.preventDefault();
    if (data.role === "0") {
      delete data.unitid;
      delete data.job;
    }
    if (data.role === "1") {
      delete data.job;
    }
    if (data.role === "2") {
      delete data.unitid;
    }
    UpdateUser(event);
  };

  const UpdateUser = () => {
    var userid = match.params.userid;
    const user = {
      name: data.name,
      lastname: data.lastname,
      password: data.password,
      personalnumber: data.personalnumber,
      unitid: data.unitid,
      job: data.job,
      role: data.role,
      validated: data.validated,
      migzar: data.migzar,
      gender: data.gender,
      cellphone: data.cellphone,
      rank: data.rank,
    };

    axios.put(`http://localhost:8000/api/user/update/${userid}`, user)
      .then(response => {
        let jobid = user.job;
        if(jobid)
        {
          axios.get(`http://localhost:8000/api/job/${jobid}`)
          .then(response => {
            let jobtoupdate = response.data;
            jobtoupdate.meaish = userid;
            axios.put(`http://localhost:8000/api/job/update/${jobid}`, jobtoupdate)
              .then(response => {
                // console.log(response);
                toast.success(`המשתמש עודכן בהצלחה`);
                history.push(`/manageusers`);
              })
              .catch((error) => {
                console.log(error);
                toast.success(`המשתמש עודכן בהצלחה-תפקיד לא שונה`);
                history.push(`/manageusers`);
              })
          })
          .catch((error) => {
            console.log(error);
          })
        }
        else{
          toast.success(`המשתמש עודכן בהצלחה`);
          history.push(`/manageusers`);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const init = () => {
    var userid = match.params.userid;
    axios.post("http://localhost:8000/api/getuserbyid", { userid })
      .then(response => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    init();
    loadUnits();
    loadPopulations();
    loadJobs();
  }, [])

  useEffect(() => {
    setData({ ...data, password: data.personalnumber });
  }, [data.personalnumber])

  return (
    <div className="">
      <Container>
        <Row>
          <Col>
            <Card>
              <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'right' }}>ערוך משתמש: {data.name} {data.lastname}</CardTitle>{/*headline*/}
              </CardHeader>

              <CardBody >
                <Container>
                  <Form role="form" style={{ direction: 'rtl' }}>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם פרטי</div>
                    <FormGroup>
                      <Input placeholder="שם פרטי" type="string" name="name" value={data.name} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם משפחה</div>
                    <FormGroup>
                      <Input placeholder="שם משפחה" type="string" name="lastname" value={data.lastname} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מספר אישי (כולל - s)</div>
                    <FormGroup >
                      <Input placeholder="מספר אישי" type="string" name="personalnumber" value={data.personalnumber} onChange={handleChange} />
                    </FormGroup>

                    {/*<div style={{ textAlign: 'right', paddingTop: '10px' }}>סיסמא</div>
                                        <FormGroup>
                                            <Input placeholder="סיסמא (אופציונלי)" type="password" name="password" value={data.password} onChange={handleChange} />
                                        </FormGroup>*/}

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מגזר</div>
                    <FormGroup >
                      <Input placeholder="מגזר" type="select" name="migzar" value={data.migzar} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={"מכונות"}>מכונות</option>
                        <option value={'תו"ן'}>תו"ן</option>
                        <option value={"חשמל"}>חשמל</option>
                        <option value={'ורסטילי'}>ורסטילי</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מין</div>
                    <FormGroup >
                      <Input placeholder='מין' type="select" name="gender" value={data.gender} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'זכר'}>זכר</option>
                        <option value={'נקבה'}>נקבה</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>פלאפון</div>
                    <FormGroup >
                      <Input placeholder="פלאפון" type="string" name="cellphone" value={data.cellphone} onChange={handleChange} />
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרגה</div>
                    <FormGroup >
                      <Input placeholder='דרגה' type="select" name="rank" value={data.rank} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value={'סג"ם'}>סג"ם</option>
                        <option value={'סג"ן'}>סג"ן</option>
                        <option value={'סר"ן'}>סר"ן</option>
                        <option value={'רס"ן'}>רס"ן</option>
                        <option value={'סא"ל'}>סא"ל</option>
                        <option value={'נגדים'}>נגדים</option>
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: "right", paddingTop: "10px" }}>אוכלוסיה</div>
                    <FormGroup dir="rtl">
                      <Input
                        type="select"
                        name="population"
                        value={data.population}
                        onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        {populations ? populations.map((population, index) => (
                          <option value={population._id}>{population.name}</option>
                        )) : null}
                      </Input>
                    </FormGroup>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>הרשאה</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" name="role" value={data.role} onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        <option value="0">מנהל מערכת</option>
                        <option value="1">הרשאת יחידה</option>
                        <option value="2">הרשאת מתמודד</option>
                      </Input>
                    </FormGroup>

                    {data.role === "0" ? (
                      <div>מנהל מערכת</div>
                    ) : data.role === "1" ? (
                      <>
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>יחידה</div>
                        <FormGroup dir="rtl">
                          <Input
                            type="select"
                            name="unitid"
                            value={data.unitid}
                            onChange={handleChange}
                          >
                            <option value={""}>יחידה</option>
                            {units.map((unit, index) => (
                              <option value={unit._id}>{unit.name}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </>
                    ) : data.role === "2" ? (
                      <>
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>תפקיד</div>
                        <FormGroup dir="rtl">
                          <Input
                            type="select"
                            name="job"
                            value={data.job}
                            onChange={handleChange}>
                            <option value={"בחר"}>בחר</option>
                            {jobs ? jobs.map((job, index) => (
                              <option value={job._id}>{job.jobname} / {job.unit.name} / {job.jobcode}</option>
                            )) : null}
                          </Input>
                        </FormGroup>
                      </>
                    ) : null}

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>מאושר/לא מאושר מערכת</div>
                    <FormGroup>
                      <Input type="select" name="validated" value={data.validated} onChange={handleChange}>
                        <option value={true}>מאושר</option>
                        <option value={false}>לא מאושר</option>
                      </Input>
                    </FormGroup>

                    <div className="text-center">
                      <button onClick={clickSubmit} className="btn btn-primary">עדכן</button>
                    </div>
                  </Form>
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default withRouter(EditUserForm);;

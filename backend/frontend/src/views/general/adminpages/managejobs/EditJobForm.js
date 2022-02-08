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

const EditJobForm = ({ match }) => {
  const [job, setJob] = useState({});

  const [units, setUnits] = useState(undefined);

  const loadUnits = () => {
    axios.get("http://localhost:8000/api/unit")
      .then((response) => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadJob = () => {
    var jobid = match.params.jobid;
    axios.get(`http://localhost:8000/api/job/${jobid}`)
      .then(response => {
        setJob(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      setJob({ ...job, [evt.target.name]: value });
  }

  const clickSubmit = (event) => {
    CheckJob(event);
  };

  const CheckJob = (event) => {
    event.preventDefault();
    var flag = true;
    var ErrorReason = "";
    if (!job.jobname) {
      flag = false;
      ErrorReason += "שם תפקיד ריק \n";
    }
    if (!job.jobcode) {
      flag = false;
      ErrorReason += "קוד תפקיד ריק \n";
    }
    if (!job.unit) {
      flag = false;
      ErrorReason += "יחידה ריקה \n";
    }

    if (flag == true) {
      if (match.params.jobid != '0') {
        UpdateJob(event);
      }
      else {
        CreateJob(event);
      }
    } else {
      toast.error(ErrorReason);
    }
  };

  const UpdateJob = () => {
    var jobid = match.params.jobid;
    axios.put(`http://localhost:8000/api/job/${jobid}`, job)
      .then(response => {
        console.log(response);
        toast.success(`תפקיד עודכן בהצלחה`);
        history.push(`/managejobs`);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const CreateJob = () => {
    axios.post(`http://localhost:8000/api/job`, job)
      .then(response => {
        console.log(response);
        toast.success(`תפקיד עודכן בהצלחה`);
        history.push(`/managejobs`);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const init = () => {
    if (match.params.jobid != '0') {
      loadJob();
    }
    loadUnits();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            {job.jobname && job.unit && match.params.jobid != '0' ? <CardHeader style={{ direction: 'rtl' }}>
              <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'right' }}>ערוך תפקיד: {job.jobname} {job.unit.name}</CardTitle>{/*headline*/}
            </CardHeader> : null}

            <CardBody >
              <Container>
                <Form role="form" style={{ direction: 'rtl' }}>

                  {match.params.jobid == '0' ?
                    <>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם תפקיד</div>
                      <Input placeholder="שם תפקיד" type="string" name="jobname" value={job.jobname} onChange={handleChange} />

                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>קוד תפקיד</div>
                      <Input placeholder="קוד תפקיד" type="number" name="jobcode" value={job.jobcode} onChange={handleChange} />
                    </> : 
                    <>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם תפקיד</div>
                    <Input placeholder="שם תפקיד" type="string" name="jobname" value={job.jobname} onChange={handleChange} disabled/>

                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>קוד תפקיד</div>
                    <Input placeholder="קוד תפקיד" type="number" name="jobcode" value={job.jobcode} onChange={handleChange} disabled/>
                  </>}

                  {units != undefined && match.params.jobid == '0' ? <>
                    <div style={{ textAlign: "right", paddingTop: "10px" }}>יחידה</div>
                    <FormGroup dir="rtl">
                      <Input
                        type="select"
                        name="unit"
                        value={job.unit}
                        onChange={handleChange}>
                        <option value={"בחר"}>בחר</option>
                        {units ? units.map((unit, index) => (
                          <option value={unit._id}>{unit.name}</option>
                        )) : null}
                      </Input>
                    </FormGroup>
                  </> :
                    units != undefined && match.params.jobid != '0' && job.unit ? <>
                      <div style={{ textAlign: "right", paddingTop: "10px" }}>יחידה</div>
                      <FormGroup dir="rtl">
                        <Input
                          disabled
                          type="select"
                          name="unit"
                          value={job.unit._id}
                          onChange={handleChange}>
                          <option value={"בחר"}>בחר</option>
                          {units ? units.map((unit, index) => (
                            <option value={unit._id}>{unit.name}</option>
                          )) : null}
                        </Input>
                      </FormGroup>
                    </> : null}

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מחלקה</div>
                  <Input placeholder="מחלקה" type="string" name="mahlaka" value={job.mahlaka} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מגזר</div>
                  <Input placeholder="מגזר" type="select" name="migzar" value={job.migzar} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={"מכונות"}>מכונות</option>
                    <option value={'תו"ן'}>תו"ן</option>
                    <option value={"חשמל"}>חשמל</option>
                    <option value={'ורסטילי'}>ורסטילי</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>ודאי/אופציה</div>
                  <Input placeholder="ודאי/אופציה" type="select" name="certain" value={job.certain} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={"ודאי"}>ודאי</option>
                    <option value={"אופציה"}>אופציה</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם מפקד</div>
                  <Input placeholder="שם מפקד" type="string" name="commander" value={job.commander} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>פלאפון מפקד</div>
                  <Input placeholder="פלאפון מפקד" type="string" name="commander_phone" value={job.commander_phone} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם מאייש</div>
                  <Input placeholder="שם מאייש" type="string" name="meaish" value={job.meaish} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>פלאפון מאייש</div>
                  <Input placeholder="פלאפון מאייש" type="string" name="meaish_phone" value={job.meaish_phone} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>דרגת תקן</div>
                  <Input placeholder='דרגת תקן' type="select" name="rank" value={job.rank} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={'סג"ם'}>סג"ם</option>
                    <option value={'סג"ן'}>סג"ן</option>
                    <option value={'סר"ן'}>סר"ן</option>
                    <option value={'רס"ן'}>רס"ן</option>
                    <option value={'סא"ל'}>סא"ל</option>
                    <option value={'נגדים'}>נגדים</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>הערות תפקיד</div>
                  <Input placeholder="הערות תפקיד" type="string" name="jobremarks" value={job.jobremarks} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תפקיד מדומ"ח</div>
                  <Input placeholder='תפקיד מדומ"ח' type="select" name="damah" value={job.damah} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={'מדומ"ח'}>מדומ"ח</option>
                    <option value={'לא מדומ"ח'}>לא מדומ"ח</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תפקיד פיקודי/מקצועי</div>
                  <Input placeholder='תפקיד פיקודי/מקצועי' type="select" name="pikodi_or_mikzoi" value={job.pikodi_or_mikzoi} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={'פיקודי'}>פיקודי</option>
                    <option value={'מקצועי'}>מקצועי</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תנאי סף 1</div>
                  <Input placeholder="תנאי סף 1" type="string" name="saf1" value={job.saf1} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תנאי סף 2</div>
                  <Input placeholder="תנאי סף 2" type="string" name="saf2" value={job.saf2} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תנאי סף 3</div>
                  <Input placeholder="תנאי סף 3" type="string" name="saf3" value={job.saf3} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תנאי סף 4</div>
                  <Input placeholder="תנאי סף 4" type="string" name="saf4" value={job.saf4} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מיקום</div>
                  <Input placeholder="מיקום" type="string" name="location" value={job.location} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>יחידה פתוחה/סגורה</div>
                  <Input placeholder='יחידה פתוחה/סגורה' type="select" name="ptoha_or_sgora" value={job.ptoha_or_sgora} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={'פתוחה'}>פתוחה</option>
                    <option value={'סגורה'}>סגורה</option>
                  </Input>

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>רמת פעילות</div>
                  <Input placeholder="רמת פעילות" type="string" name="peilut_level" value={job.peilut_level} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תיאור תפקיד</div>
                  <Input placeholder="תיאור תפקיד" type="string" name="description" value={job.description} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>תרומת התפקיד לפרט</div>
                  <Input placeholder="תרומת התפקיד לפרט" type="string" name="job_contribution" value={job.job_contribution} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>יכולת חשיבה ותכנון</div>
                  <Input placeholder="יכולת חשיבה ותכנון" type="string" name="thinking_ability" value={job.thinking_ability} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>יחסים בינאישיים</div>
                  <Input placeholder="יחסים בינאישיים" type="string" name="realtionship_ability" value={job.realtionship_ability} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>יכולת ניהול וארגון</div>
                  <Input placeholder="יכולת ניהול וארגון" type="string" name="management_ability" value={job.management_ability} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>יכולת מנהיגות ופיקוד</div>
                  <Input placeholder="יכולת מנהיגות ופיקוד" type="string" name="leadership_ability" value={job.leadership_ability} onChange={handleChange} />

                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>רמת סיווג</div>
                  <Input placeholder='רמת סיווג' type="select" name="sivug" value={job.sivug} onChange={handleChange}>
                    <option value={"בחר"}>בחר</option>
                    <option value={'בלמ"ס'}>בלמ"ס</option>
                    <option value={'סודי'}>סודי</option>
                    <option value={'סודי ביותר'}>סודי ביותר</option>
                  </Input>

                  <div className="text-center">
                    <button onClick={clickSubmit} className="btn btn-primary">עדכן</button>
                  </div>
                </Form>
              </Container>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container >
  );
}
export default withRouter(EditJobForm);;

import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Card, CardHeader, CardBody, CardTitle, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Row } from 'reactstrap';
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

import soldier from "assets/img/soldier.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ProfilePageModal from 'views/general/generalpages/profilepage/ProfilePageModal';
import MahzorFormFilter from 'components/tafkidipedia/Filters/MahzorFormFilter';

const MahzorCandidates3 = (props) => {
    const [tempjobcode, setTempjobcode] = useState("");

    const [units, setUnits] = useState([]);

    const [isprofilepageopen, setIsprofilepageopen] = useState(false);
    const [useridformodal, setUseridformodal] = useState(undefined);

    // filter
    const [candidatestoshow, setCandidatestoshow] = useState({})

    const [candidatefilter, setCandidatefilter] = useState({})

    const [onetimeflag, setOnetimeflag] = useState(false)
    // filter
    
    function Toggle(evt) {
        setUseridformodal(evt.target.value)
        setIsprofilepageopen(!isprofilepageopen);
    }

    function handleChangetempjobcode(evt) {
        const value = evt.target.value;
        setTempjobcode(value);
    }

    const loadunits = async () => {
        await axios.get(`http://localhost:8000/api/unit`)
            .then(response => {
                setUnits(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function init() {
        loadunits();
    }

    const setfilter = (evt) => {
        if (evt.currentTarget.name == 'movement') {
            if (candidatefilter.movementfilter) {
                let tempmovementfilter = [...candidatefilter.movementfilter]
                const index = tempmovementfilter.indexOf(evt.currentTarget.value);
                if (index > -1) {
                    tempmovementfilter.splice(index, 1);
                }
                else {
                    tempmovementfilter.push(evt.currentTarget.value)
                }
                setCandidatefilter({ ...candidatefilter, movementfilter: tempmovementfilter })
            }
            else {
                setCandidatefilter({ ...candidatefilter, movementfilter: [evt.currentTarget.value] })
            }
        }
    }

    const applyfiltersontodata = () => {
        let tempdatabeforefilter = [...props.users];

        let myArrayMovementFiltered = [];
        if (candidatefilter.movementfilter && candidatefilter.movementfilter.length > 0) {
            myArrayMovementFiltered = tempdatabeforefilter.filter((el) => {
                return candidatefilter.movementfilter.some((f) => {
                    return f === el.movement;
                });
            });
        }
        else {
            myArrayMovementFiltered = tempdatabeforefilter;
        }

        let myArrayMovementAndIdFiltered = [];
        if (candidatefilter.useridFilter && candidatefilter.useridFilter.length > 0) {
            myArrayMovementAndIdFiltered = myArrayMovementFiltered.filter((el) => {
                return candidatefilter.useridFilter.some((f) => {
                    return f === el._id;
                });
            });
        }
        else {
            myArrayMovementAndIdFiltered = myArrayMovementFiltered;
        }

        setCandidatestoshow(myArrayMovementAndIdFiltered)
    }

    function handleChangeManage(evt) {
        props.handleChangeUser(evt);
        applyfiltersontodata();
    }

    function handle_change_candidate_name(evt) {
        if(evt.value!='בחר מתמודד')
        {
        setCandidatefilter({ ...candidatefilter, useridFilter: [evt.value] })
        applyfiltersontodata();
        }
        else{
            setCandidatefilter({ ...candidatefilter, useridFilter: [] })
            applyfiltersontodata();
        }
    }

    useEffect(() => {
        applyfiltersontodata();
    }, [candidatefilter]);

    useEffect(() => {
        if (onetimeflag == false && candidatestoshow.length == 0 && props.users.length>0) {
            setCandidatestoshow([...props.users]);
            setOnetimeflag(true);
        }
    }, [props.users])

    useEffect(() => {
        init();
    }, [])

    return (
        props.mahzordata.population != undefined ?
            <>
                <Card>
                    <CardHeader style={{ direction: 'rtl' }}>
                        <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>מועמדים</CardTitle>{/*headline*/}
                    </CardHeader>
                    <CardBody style={{ direction: 'ltr' }}>
                        {/* <Container>
                        <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                            <div style={{ float: 'right' }}>
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="btn-green"
                                    table="table-to-xls"
                                    filename="קובץ - מתמודדים במחזור"
                                    sheet="קובץ - מתמודדים במחזור"
                                    buttonText="הורד כקובץ אקסל" />
                            </div>
                            <table id="table-to-xls">
                                <thead>
                                    <tr>
                                        <th>מספר אישי</th>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>תנועה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.users ? props.users.map((user, userindex) => (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{user.personalnumber}</td>
                                            <td style={{ textAlign: "center" }}>{user.name}</td>
                                            <td style={{ textAlign: "center" }}>{user.lastname}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Input type="select" name={userindex} value={user.movement} onChange={props.handleChangeUser}>
                                                    {props.movement.map((movement, index) => (
                                                        <option key={index} value={movement._id}>{movement.name}</option>
                                                    ))}
                                                </Input>
                                            </td>
                                        </tr>
                                    )) : null}
                                </tbody>
                            </table>
                        </Row>
                    </Container> */}
                        <MahzorFormFilter originaldata={props.users} candidatefilter={candidatefilter} setfilter={setfilter} candidatestoshow={candidatestoshow} handle_change_candidate_name={handle_change_candidate_name}/>
                        <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                            {candidatestoshow ? candidatestoshow.map((user, userindex) => (
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                    <Card style={{ direction: 'ltr', background: '#1e1e2f' }}>
                                        <CardBody style={{ direction: 'rtl' }}>
                                            <Row>
                                                <Col xs={12} md={5}>
                                                    <img src={soldier} style={{}}></img>
                                                </Col>
                                                <Col xs={12} md={7}>
                                                    <Button value={user._id} onClick={Toggle} style={{ width: '100%' }}>
                                                        {user.name} {user.lastname}
                                                    </Button>
                                                    <Input style={{ color: 'white', textAlign: 'center' }} type="select" name={user._id} value={user.movement} onChange={handleChangeManage}>
                                                        {props.movement.map((movement, index) => (
                                                            <option style={{ textAlign: 'center' }} key={index} value={movement._id}>{movement.name}</option>
                                                        ))}
                                                    </Input>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )) : null}
                        </Row>
                        <ProfilePageModal isOpen={isprofilepageopen} userid={useridformodal} Toggle={Toggle} />
                    </CardBody>
                </Card>

                {props.mahzordata._id != undefined ?
                    <>
                        <Card>
                            <CardHeader style={{ direction: 'rtl' }}>
                                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>תפקידים חדשים</CardTitle>{/*headline*/}
                                <FormGroup dir="rtl" >
                                    <Row>
                                        <Col xs={12} md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                        </Col>
                                        <Col xs={12} md={4} style={{ margin: 'auto' }}>
                                            {/* <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף תפקיד</div> */}
                                            <Input type="number" value={tempjobcode} placeholder={'הכנס קוד תפקיד'} onChange={handleChangetempjobcode}></Input>
                                        </Col>
                                        <Col xs={12} md={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button type="primary" onClick={() => props.SerachAndAddJobToJobsList(tempjobcode)}>חפש תפקיד והוסף</Button>
                                        </Col>
                                        <Col xs={12} md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </CardHeader>
                            <CardBody style={{ direction: 'ltr' }}>
                                <Container>
                                    <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                                        <div style={{ float: 'right' }}>
                                            <ReactHTMLTableToExcel
                                                id="test-table-xls-button"
                                                className="btn-green"
                                                table="table-to-xls"
                                                filename="קובץ - מתמודדים במחזור"
                                                sheet="קובץ - מתמודדים במחזור"
                                                buttonText="הורד כקובץ אקסל" />
                                        </div>
                                        <table id="table-to-xls">
                                            <thead>
                                                <tr>
                                                    <th>שם תפקיד</th>
                                                    <th>קוד תפקיד</th>
                                                    <th>יחידה</th>
                                                    <th>תנועה</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.jobs ? props.jobs.map((job, jobindex) => !job.meaish ? (
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>{job.jobname}</td>
                                                        <td style={{ textAlign: "center" }}>{job.jobcode}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Input type="select" value={job.unit._id} disabled>
                                                                {units.map((unit, index) => (
                                                                    <option key={index} value={unit._id}>{unit.name}</option>
                                                                ))}
                                                            </Input>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Input type="select" value={job.certain} name={jobindex} onChange={props.handleChangeJobCertain}>
                                                                <option value={'ודאי'}>ודאי</option>
                                                                <option value={'אופציה'}>אופציה</option>
                                                            </Input>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button onClick={() => props.deletejobfromjobs(jobindex)}>מחק</Button>
                                                        </td>
                                                    </tr>
                                                ) : null) : null}
                                            </tbody>
                                        </table>
                                    </Row>
                                </Container>
                            </CardBody>
                        </Card></> : null}
            </> : null
    );
}
export default withRouter(MahzorCandidates3);;
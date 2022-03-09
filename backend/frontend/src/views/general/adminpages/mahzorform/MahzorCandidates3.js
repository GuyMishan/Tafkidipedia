import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
// reactstrap components
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Card, CardHeader, CardBody, CardTitle, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Row } from 'reactstrap';
import axios from 'axios';
import history from 'history.js'
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";

import soldier from "assets/img/soldier.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import ProfilePageModal from 'views/general/generalpages/profilepage/ProfilePageModal';

const MahzorCandidates3 = (props) => {

    const [userstopresent, setUserstppresent] = useState([]); //users to candidate

    const [jobs, setJobs] = useState([]);

    const [isprofilepageopen, setIsprofilepageopen] = useState(false);
    const [useridformodal, setUseridformodal] = useState(undefined);

    function Toggle(evt) {
        setUseridformodal(evt.target.value)
        setIsprofilepageopen(!isprofilepageopen);
    }

    const loaduserstopresent = () => {
        let tempuserstopresent = [];
        if (props.users && jobs && jobs.length != 0 && props.users.length != 0) {
            for (let i = 0; i < props.users.length; i++) {
                tempuserstopresent[i] = props.users[i];
                for (let j = 0; j < jobs.length; j++) {
                    if (tempuserstopresent[i].job == jobs[j]._id) {
                        tempuserstopresent[i].jobtopresent = jobs[j];
                    }
                }
            }
            setUserstppresent(tempuserstopresent)
        }
    }

    useEffect(() => {
        loaduserstopresent()
    }, [props.users]);

    useEffect(() => {
        loadjobs();
    }, []);

    const loadjobs = async () => {
        await axios.get(`http://localhost:8000/api/smartjobs`)
            .then(response => {
                setJobs(response.data, loaduserstopresent);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        props.mahzordata.population != undefined ?
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
                    <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                        {userstopresent ? userstopresent.map((user, userindex) => (
                            <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                <Card style={{ direction: 'ltr', background: 'linear-gradient(0deg, rgb(27 42 54) 0%, rgb(12,31,45) 100%)' }}>
                                    <CardBody style={{ direction: 'rtl' }}>
                                        <Row>
                                            <Col xs={12} md={5}>
                                                <img src={soldier} style={{}}></img>
                                            </Col>
                                            <Col xs={12} md={7}>
                                                <Button value={user._id} onClick={Toggle} style={{ width: '100%' }}>
                                                    {user.name} {user.lastname}
                                                </Button>
                                                <h5 style={{ color: 'white', textAlign: 'center' }}>{user.jobtopresent.unit.name}/{user.jobtopresent.jobname}</h5>
                                                <Input style={{ color: 'white', textAlign: 'center' }} type="select" name={userindex} value={user.movement} onChange={props.handleChangeUser}>
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
            </Card> : null
    );
}
export default withRouter(MahzorCandidates3);;
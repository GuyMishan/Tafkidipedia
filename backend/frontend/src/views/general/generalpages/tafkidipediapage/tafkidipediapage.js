import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import { Link, withRouter, Redirect } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom'

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
} from "reactstrap";
import axios from 'axios';

import soldier from "assets/img/soldier.png";
import JobAnimatedMultiSelect from "components/tafkidipedia/Select/JobAnimatedMultiSelect";

function Tafkidipediapage() {
    const [jobs, setJobs] = useState([])

    function init() {
        getJobs();
    }

    const getJobs = async () => {
        let alljobs = [];
        let result = await axios.get(`http://localhost:8000/api/smartjobs2`);
        alljobs = result.data
        let result2 = await axios.get(`http://localhost:8000/api/smartjobs`);
        for (let i = 0; i < result2.data.length; i++) {
            let isalreadyinarr = false;
            for (let j = 0; j < alljobs.length; j++) {
                if (result2.data[i]._id == alljobs[j]._id) {
                    isalreadyinarr = true;
                }
            }
            if (isalreadyinarr == false) {
                alljobs.push(result2.data[i])
            }
        }
        setJobs(alljobs);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div style={{ width: '95%' }}>
                <Card>
                    <CardBody>
                        {/* <table id="table-to-xls">
                            <thead>
                                <tr>
                                    <th>שם תפקיד</th>
                                    <th>יחידה</th>
                                    <th>מאייש</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs ? jobs.map((job, index) => (
                                    <tr>
                                        <td style={{ textAlign: "center" }}>{job.jobname}</td>
                                        <td style={{ textAlign: "center" }}>{job.unit.name}</td>
                                        {job.meaish ? <td style={{ textAlign: "center" }}>{job.meaish.name} {job.meaish.lastname}</td> : <td style={{ textAlign: "center" }}></td>}
                                    </tr>
                                )) : null}
                            </tbody>
                        </table> */}
                        <Row style={{ direction: "rtl", paddingTop: '10px' }}>
                            <Col xs={12} md={4} style={{ alignSelf: 'center' }}>
                                <div style={{ direction: 'rtl', textAlign: 'right' }}>
                                    <JobAnimatedMultiSelect />
                                </div>
                            </Col>
                            <Col xs={12} md={4} style={{ alignSelf: 'center' }}>
                            </Col>
                            <Col xs={12} md={4} style={{ alignSelf: 'center' }}>
                            </Col>
                        </Row>
                        <Row style={{ direction: "rtl", paddingTop: '10px' }}>
                            {jobs ? jobs.map((job, index) => (
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                    <Card style={{ direction: 'ltr', background: 'linear-gradient(0deg, rgb(27 42 54) 0%, rgb(12,31,45) 100%)' }}>
                                        <CardBody style={{ direction: 'rtl' }}>
                                            <Row>
                                                <Col xs={12} md={5}>
                                                    {job.unit.englishname ? <img src={require(`assets/img/unitsimg/${job.unit.englishname}.png`)}></img> : <img src={soldier}></img>}
                                                </Col>
                                                <Col xs={12} md={7} style={{ padding: '0px' }}>
                                                    <button className="btn-empty"/*value={user._id} onClick={Toggle}*/ style={{ width: '100%' }}>
                                                        <h2 style={{ color: 'white', marginBottom: '10px' }}>{job.jobname}</h2>
                                                    </button>
                                                    <h3 style={{ color: 'grey', marginBottom: '10px', textAlign: 'center' }}>{job.unit.name}</h3>
                                                    {job.meaish ?
                                                        <button className="btn-empty"/*value={user._id} onClick={Toggle}*/ style={{ width: '100%' }}>
                                                            <h4 style={{ color: 'gray', marginBottom: '10px' }}>{job.meaish.name ? job.meaish.name : null} {job.meaish.lastname ? job.meaish.lastname : null}</h4>
                                                        </button> :
                                                        <button className="btn-empty"/*value={user._id} onClick={Toggle}*/ style={{ width: '100%' }}>
                                                            <h4 style={{ color: 'gray', marginBottom: '10px' }}> </h4>
                                                        </button>}

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )) : null}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

export default withRouter(Tafkidipediapage);
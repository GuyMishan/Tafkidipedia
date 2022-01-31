import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Row } from 'reactstrap';

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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const MahzorJobs = (props) => {
    useEffect(() => {

    }, [props]);

    return (
        <Card>
            <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>תפקידים</CardTitle>{/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: 'ltr' }}>
                <Container>
                    {props.mahzordata.status == 1 ?
                        <div>
                            <form>
                                <FormGroup row>
                                    <Col xs={4} sm={8} lg={10}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <Button color="info" style={{ color: "white", zIndex: 0 }} onClick={props.openFileBrowser}><i className="cui-file"></i> Browse&hellip;</Button>
                                                <input type="file" hidden onChange={props.fileHandler} ref={props.fileInput} onClick={(event) => { event.target.value = null }} style={{ "padding": "10px" }} />
                                            </InputGroupAddon>
                                            <Input type="text" className="form-control" value={props.state.uploadedFileName} readOnly invalid={props.state.isFormInvalid} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                            <FormFeedback>
                                                <Fade in={props.state.isFormInvalid} tag="h6" style={{ fontStyle: "italic" }}>
                                                    Please select a .xlsx file only !
                                                </Fade>
                                            </FormFeedback>
                                        </InputGroup>
                                    </Col>
                                    <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">העלאת תפקידים</Label>
                                </FormGroup>
                            </form>

                            <Row>
                                <Col xs={12} md={12}>
                                    <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף תפקיד</div>
                                    <FormGroup dir="rtl" >
                                        <Input type="select" onChange={props.AddJobToJobsToAdd}>
                                            <option value={"בחר תפקיד"}>בחר תפקיד</option>
                                            {props.jobs.map((job, index) => (
                                                <option key={index} value={index}>{job.jobname} / {job.unit.name} / {job.jobcode}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div> : null}

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
                        <table>
                            <thead>
                                <tr>
                                    <th>סוג תפקיד</th>
                                    <th>יחידה</th>
                                    <th>מחלקה</th>
                                    <th>מגזר</th>
                                    <th>מאייש</th>
                                    <th>מיקום</th>
                                    <th>סיווג</th>
                                    <th>ודאי/לא ודאי</th>
                                    {props.mahzordata.status == 1 ?
                                        <th>מחק</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {props.jobstoadd ? props.jobstoadd.map((job, index) => (
                                    <tr>
                                        <td style={{ textAlign: "center" }}>{job.jobname}</td>
                                        <td style={{ textAlign: "center" }}>{job.unit.name}</td>
                                        <td style={{ textAlign: "center" }}>{job.mahlaka}</td>
                                        <td style={{ textAlign: "center" }}>{job.migzar}</td>
                                        <td style={{ textAlign: "center" }}>{job.meaish}</td>
                                        <td style={{ textAlign: "center" }}>{job.location}</td>
                                        <td style={{ textAlign: "center" }}>{job.sivug}</td>
                                        <td style={{ textAlign: "center" }}>{job.certain}</td>
                                        {props.mahzordata.status == 1 ?
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: "0.5rem" }}
                                                    onClick={() => props.DeleteJobFromJobsToAdd(job)}
                                                >
                                                    <img
                                                        src={deletepic}
                                                        alt="bookmark"
                                                        style={{ height: "2rem" }}
                                                    />
                                                </button>
                                            </td>
                                            : null}
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
}
export default withRouter(MahzorJobs);;
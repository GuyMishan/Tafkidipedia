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

const MahzorJobs = (props) => {

    const isUnit = (unit) => unit._id == props.tempjobtoadd.unit._id;
    const UnitIndex = event => {
        var tempunits = props.units;
        return props.tempjobtoadd.unit ? tempunits.findIndex(isUnit) : 0;
    }

    const isJob = (jobtype) => jobtype._id == props.tempjobtoadd.jobtype._id;
    const JobIndex = event => {
        var tempjobtypes = props.jobtypes;
        return props.tempjobtoadd.jobtype ? tempjobtypes.findIndex(isJob) : 0;
    }

    return (
        <Card>
            <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>תפקידים</CardTitle>{/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: 'rtl' }}>
                <Container>
                    {props.mahzordata.status == 1 ?
                        <Button type="primary" onClick={() => props.OpenModal()}>
                            הוסף תפקיד
                    </Button>
                        : null}
                    <SettingModal
                        title="הוסף תפקיד"
                        isOpen={props.isjobmodalopen}>
                        <div style={{ direction: 'rtl' }}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>בחר סוג תפקיד</div>
                            <Input
                                type="select"
                                name="jobtype" value={JobIndex()} onChange={props.TempJobToAddhandleChange}
                            >
                                {/* <option value={"בחר סוג תפקיד"}>בחר סוג תפקיד</option> */}
                                {props.jobtypes.map((jobtype, index) => (
                                    <option key={index} value={index}>{jobtype.jobname}</option>
                                ))}
                            </Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>בחר יחידה</div>
                            <Input
                                type="select"
                                name="unit" value={UnitIndex()} onChange={props.TempJobToAddhandleChange}
                            >
                                {/* <option value={"בחר יחידה"}>בחר יחידה</option> */}
                                {props.units.map((unit, index) => (
                                    <option key={index} value={index}>{unit.name}</option>
                                ))}
                            </Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>מחלקה</div>
                            <Input type="text" name="mahlaka" value={props.tempjobtoadd.mahlaka} onChange={props.TempJobToAddhandleChange}></Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תחום</div>
                            <Input type="text" name="thom" value={props.tempjobtoadd.thom} onChange={props.TempJobToAddhandleChange}></Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>מיקום</div>
                            <Input type="text" name="location" value={props.tempjobtoadd.location} onChange={props.TempJobToAddhandleChange}></Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>פעילות</div>
                            <Input type="text" name="peilut" value={props.tempjobtoadd.peilut} onChange={props.TempJobToAddhandleChange}></Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>דמ"ח</div>
                            <Input type="select" name="damah" value={props.tempjobtoadd.damah} onChange={props.TempJobToAddhandleChange}>
                                <option value={'בחר דמ"ח'}>בחר דמ"ח</option>
                                <option value={true}>יש</option>
                                <option value={false}>אין</option>
                            </Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>סיווג</div>
                            <Input type="select" name="sivug" value={props.tempjobtoadd.sivug} onChange={props.TempJobToAddhandleChange}>
                                <option value={"בחר סיווג"}>בחר סיווג</option>
                                <option value={"1"}>1</option>
                                <option value={"2"}>2</option>
                                <option value={"3"}>3</option>
                                <option value={"ללא סיווג"}>ללא סיווג</option>
                            </Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>ודאי/לא ודאי</div>
                            <Input type="select" name="certain" value={props.tempjobtoadd.certain} onChange={props.TempJobToAddhandleChange}>
                                <option value={"בחר ודאי/לא ודאי"}>בחר ודאי/לא ודאי</option>
                                <option value={true}>ודאי</option>
                                <option value={false}>לא ודאי</option>
                            </Input>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תיאור</div>
                            <Input type="text" name="description" value={props.tempjobtoadd.description} onChange={props.TempJobToAddhandleChange}></Input>
                            <Button onClick={() => props.AddJobToJobsToAdd()}>הוסף</Button>
                            <Button onClick={() => props.CheckModalClosing()}>סגור</Button>
                        </div>
                    </SettingModal>
                    <table>
                        <thead>
                            <tr>
                                <th>סוג תפקיד</th>
                                <th>יחידה</th>
                                <th>מחלקה</th>
                                <th>תחום</th>
                                {/* <th>תיאור</th> */}
                                <th>מיקום</th>
                                <th>פעילות</th>
                                <th>דמ"ח</th>
                                <th>סיווג</th>
                                <th>ודאי/לא ודאי</th>
                                {/* <th>ערוך</th> */}
                                {props.mahzordata.status == 1 ?
                                    <th>מחק</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {props.jobstoadd ? props.jobstoadd.map((job, index) => (
                                <tr>
                                    <td style={{ textAlign: "center" }}>{job.jobtype.jobname}</td>
                                    <td style={{ textAlign: "center" }}>{job.unit.name}</td>
                                    <td style={{ textAlign: "center" }}>{job.mahlaka}</td>
                                    <td style={{ textAlign: "center" }}>{job.thom}</td>
                                    {/* <td style={{ textAlign: "center" }}>{job.description}</td> */}
                                    <td style={{ textAlign: "center" }}>{job.location}</td>
                                    <td style={{ textAlign: "center" }}>{job.peilut}</td>
                                    <td style={{ textAlign: "center" }}>{job.damah.toString() /* == true ? "אין" : "יש"*/}</td>
                                    <td style={{ textAlign: "center" }}>{job.sivug}</td>
                                    <td style={{ textAlign: "center" }}>{job.certain.toString() /* == true ? "לא ודאי" : "ודאי"*/}</td>
                                    {/* <td style={{ textAlign: "center" }}>
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: "0.5rem" }}
                                        onClick={() => props.PrepEditModal(job)}
                                    >
                                        <img
                                            src={editpic}
                                            alt="bookmark"
                                            style={{ height: "2rem" }}
                                        />
                                    </button>
                                </td> */}
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
                        <SettingModal
                            title="ערוך תפקיד"
                            isOpen={props.iseditjobmodalopen}
                        >
                        </SettingModal>
                    </table>
                </Container>
            </CardBody>
        </Card>
    );
}
export default withRouter(MahzorJobs);;
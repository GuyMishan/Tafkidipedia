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

const MahzorCandidates3 = (props) => {
    useEffect(() => {

    }, [props]);

    return (
        props.mahzordata.population != undefined ?
            <Card>
                <CardHeader style={{ direction: 'rtl' }}>
                    <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>מועמדים</CardTitle>{/*headline*/}
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
                    </Container>
                </CardBody>
            </Card> : null
    );
}
export default withRouter(MahzorCandidates3);;
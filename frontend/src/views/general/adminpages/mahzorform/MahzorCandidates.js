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

import soldier from "assets/img/soldier.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";
import MahzorDataComponent from './MahzorDataComponent';

const MahzorCandidates = (props) => {

    function init() {

    }

    useEffect(() => {
        init();
    }, [])

    return (
        <Card>
            <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>מועמדים</CardTitle>{/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: 'rtl' }}>
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף מועמד</div>
                            <FormGroup dir="rtl" >
                                <Input type="select" onChange={props.handleChangeUsersToCandidate}>
                                    <option value={"בחר מועמד"}>בחר מועמד</option>
                                    {props.users.map((user, index) => (
                                        <option key={index} value={index}>{user.name} {user.lastname}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                        {props.userstocandidate ? props.userstocandidate.map((user, index) => (
                            <Col xs={12} md={4} key={index}>
                                <Card style={{ direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px' }}>
                                    <Row>
                                        <Col xs={12} md={2} style={{ textAlign: 'center', alignSelf: 'center' }}>
                                            <img src={soldier} alt="bookmark" style={{ height: "2rem" }} />
                                        </Col>
                                        <Col xs={12} md={7} style={{ alignSelf: 'center' }}>
                                            <h3 style={{ textAlign: "right", margin: '0px' }}>{user.name} {user.lastname}</h3>
                                        </Col>
                                        <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                            <Button className="btn btn-danger" onClick={(e) => props.DeleteUserFromUsersToCandidate(user, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )) : null}
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
}
export default withRouter(MahzorCandidates);;
import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

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

import soldierphoto from "assets/img/soldier.png";

function UserInfoCardPicture(props) {

    return (
        <Card>
            <CardBody>
                <Container style={{textAlign:'center'}}>
                    <img src={soldierphoto}></img>
                    <h2 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>{props.user.name} {props.user.lastname}</h2>
                    <h4 style={{ textAlign: 'center', color: 'gray', margin: '0px' }}>{props.user.personalnumber}</h4>
                    <h4 style={{ textAlign: 'center', color: 'gray', margin: '0px' }}>{props.user.job ? props.user.job.jobname : null}</h4>
                    <h4 style={{ textAlign: 'center', color: 'gray', margin: '0px' }}>{props.user.job.unit ? props.user.job.unit.name : null}</h4>
                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardPicture);
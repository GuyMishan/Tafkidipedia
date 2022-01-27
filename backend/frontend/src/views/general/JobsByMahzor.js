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

import JobsByMahzorSortingTable from 'components/tafkidipedia/JobsByMahzorSortingTable/SortingTable';

const JobsByMahzor = (props) => {

    function init() {

    }

    useEffect(() => {
        init();
    }, [])

    return (
        <Container>
        <Card>
            <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>תפקידים במחזור</CardTitle>{/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: 'rtl' }}>
                <Container>
                    <JobsByMahzorSortingTable/>
                </Container>
            </CardBody>
        </Card>
        </Container>
    );
}
export default withRouter(JobsByMahzor);;
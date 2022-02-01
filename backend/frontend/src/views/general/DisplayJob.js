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

import axios from 'axios';

import PanelHeader from "components/general/PanelHeader/PanelHeader";

function DisplayJob({ match }) {
  //mahzor
  const [jobdata, setJobData] = useState({})
  //job

  const loadjob = () => {
    axios.get(`http://localhost:8000/api/jobinmahzorbyid/${match.params.jobid}`)
      .then(response => {
        let tempjob = response.data[0];
        setJobData(tempjob.job);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function init() {
    loadjob()
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Container>
      <PanelHeader size="sm" content={
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{jobdata ? jobdata.jobname : null} - {jobdata.certain}</h1>
        </Container>} />

      <Row>
        <Col>
          <Card style={{ marginTop: '30px' }}>
            <CardHeader>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>תיאור התפקיד</h3>
            </CardHeader>
            <CardBody style={{ textAlign: 'right' }}>
              {jobdata.description}
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card style={{ marginTop: '30px' }}>
            <CardHeader>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>פרטי התפקיד</h3>
            </CardHeader>
            <CardBody>
              <Container>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>מחלקה:</h5> {jobdata.mahlaka}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>תחום:</h5> {jobdata.thom}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>מיקום:</h5> {jobdata.location}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>רמת פעילות:</h5> {jobdata.peilut}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>דמ"ח:</h5> {jobdata.damah}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>סיווג:</h5> {jobdata.sivug}</Row>
              <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>ודאי/אופציה:</h5> {jobdata.certain}</Row>
              </Container>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default withRouter(DisplayJob);
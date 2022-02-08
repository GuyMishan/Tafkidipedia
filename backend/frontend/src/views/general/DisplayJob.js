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

          <Card style={{ marginTop: '30px' }}>
            <CardHeader>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>תרומת התפקיד לפרט</h3>
            </CardHeader>
            <CardBody style={{ textAlign: 'right' }}>
              {jobdata.job_contribution}
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
                {jobdata.unit ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>יחידה: </h5> <h5> {jobdata.unit.name}</h5></Row> : null}
                {jobdata.rank ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>דרגת תקן: </h5> <h5> {jobdata.rank}</h5></Row> : null}
                {jobdata.sivug ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>סיווג תפקיד: </h5> <h5> {jobdata.sivug}</h5></Row> : null}
                {jobdata.damah ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>תפקיד מדומ"ח: </h5> <h5> {jobdata.damah}</h5></Row> : null}
                {jobdata.pikodi_or_mikzoi ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>פיקוד/מקצועי: </h5> <h5> {jobdata.pikodi_or_mikzoi}</h5></Row> : null}
              </Container>
            </CardBody>
          </Card>

          <Card style={{ marginTop: '30px' }}>
            <CardHeader>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>נתוני סף (תנאי להתמודדות)</h3>
            </CardHeader>
            <CardBody>
              <Container>
                {jobdata.saf1 ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>א: </h5> <h5> {jobdata.saf1}</h5></Row> : null}
                {jobdata.saf2 ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>ב: </h5> <h5> {jobdata.saf2}</h5></Row> : null}
                {jobdata.saf3 ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>ג: </h5> <h5> {jobdata.saf3}</h5></Row> : null}
                {jobdata.saf4 ? <Row><h5 style={{ textAlign: 'right', fontWeight: 'bold' }}>ד: </h5> <h5> {jobdata.saf4}</h5></Row> : null}
              </Container>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>כישורים נדרשים לתפקיד</h3>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>יכולת חשיבה ותכנון:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.thinking_ability}
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>יחסים בינאישיים:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.realtionship_ability}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>יכולות ניהול וארגון:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.management_ability}
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מנהיגות ופיקוד:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.leadership_ability}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col style={{alignItems:'center'}}>
          <Row style={{alignItems:'center'}}>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מנהיגות ופיקוד:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.leadership_ability}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מנהיגות ופיקוד:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.leadership_ability}
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card>
                <CardHeader>
                  <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מנהיגות ופיקוד:</h4>
                </CardHeader>
                <CardBody style={{ textAlign: 'right' }}>
                  {jobdata.leadership_ability}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default withRouter(DisplayJob);
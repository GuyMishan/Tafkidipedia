import React, { useState } from "react";
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

import UserCard from "components/general/DashboardCards/UserCard/UserCard";

import plus from "assets/img/add.png";
import MahzorsDisplay from "./MahzorsDisplay";

function AdminDashboard() {

  return (
    <>
      <Container>
        <UserCard />
      </Container>

      <Container style={{ paddingTop: '2rem' }}>
        <MahzorsDisplay />
      </Container>
    </>
  );
}

export default withRouter(AdminDashboard);
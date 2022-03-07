import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";

import {
  BackgroundColorContext,
  backgroundColors,
} from "contexts/BackgroundColorContext";

import { ThemeContext, themes } from "contexts/ThemeContext";

import tafkidipedialogo from "assets/img/tafkidipedialogo.png";
import home from "assets/img/home3.png";
import table from "assets/img/table.png";
import followers from "assets/img/followers.png";
import shortlist from "assets/img/shortlist.png";
import people from "assets/img/people.png";
import { signout } from "auth/index";
import history from "../../../history";

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
  Col,
} from "reactstrap";

import { signin, authenticate, isAuthenticated } from "auth/index";

function SidebarUnit() {
  const { user } = isAuthenticated();

  const clickSubmit = (event) => {
    event.preventDefault();
    signout().then((response) => {
      history.push(`/signin`);
    });
  };

  return (
    <>
    <div className="logo">
      <img src={tafkidipedialogo}></img>
    </div>
    <Nav style={{ textAlign: "right"}}>
      <li>
        <NavLink to={`/unitdashboard/${user.unitid}`} style={{ margin: '0px' }} activeClassName="sidebar_active_link">
          <Row style={{ direction: "rtl"}}>
            <Col xs={12} md={3} style={{ paddingLeft: "0px",textAlign:'center',alignSelf:'center' }}>
              <img src={home} style={{ height: "20px" }}></img>
            </Col>
            <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
              <h4 style={{ margin: "0px",paddingTop:'6px',paddingBottom:'6px' }}>
                דף הבית
              </h4>
            </Col>
          </Row>
        </NavLink>
      </li>
      <li>
        <NavLink to={`/unitmahzorimpage/${user.unitid}`} style={{ margin: '0px' }} activeClassName="sidebar_active_link">
          <Row style={{ direction: "rtl" }}>
          <Col xs={12} md={3} style={{ paddingLeft: "0px",textAlign:'center',alignSelf:'center' }}>
              <img src={table} style={{ height: "20px" }}></img>
            </Col>
            <Col xs={12} md={9} style={{ paddingRight: "0px" }}>
            <h4 style={{ margin: "0px",paddingTop:'6px',paddingBottom:'6px' }}>
                דיוני איוש
              </h4>
            </Col>
          </Row>
        </NavLink>
      </li>

    </Nav>
    <div style={{ justifyContent: 'center', textAlign: 'center', bottom: 0, width: '100%' }}>
      {/* <Button
        onClick={clickSubmit}
        className="btn-danger"
        style={{ width: '80%' }}
      >
        התנתק
      </Button> */}
    </div>
  </>
  );
}

export default SidebarUnit;

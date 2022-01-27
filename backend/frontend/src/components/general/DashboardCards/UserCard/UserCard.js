
import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { isAuthenticated } from '../../../../auth/index';
import {
    Card,
    CardText,
    CardBody,
    CardLink,
    CardTitle,
    Container,
    Row,
    Col,
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
} from "reactstrap";
import { ThemeContext, themes } from "contexts/ThemeContext";

import history from "../../../../history";

import soldier from "assets/img/soldier.png";
import tafkidipediashortlogo from "assets/img/tafkidipediashortlogo.png";

import UserCarousel from "./UserCarousel"

const signout = (event) => {
    event.preventDefault();
    signout().then((response) => {
    
      history.push(`/signin`);
    });
  };

const UserCard = (props) => {
    const { user } = isAuthenticated()
    const [value, onChange] = useState(new Date());

    return (
        <ThemeContext.Consumer>
            {({ changeTheme, theme }) => (
                theme == "white-content" ?
                    <Card style={{ borderRadius: '40px' ,boxShadow:"0 1px 10px 0 rgb(0 0 0 / 10%), 0 1px 10px 0 rgb(0 0 0 / 15%)",marginBottom:'10px'}}>
                        <CardBody style={{ padding: "0px" }}>
                            <Row style={{ margin: 'auto' }}>
                                <Col lg="2" style={{ padding: "0px" }}>
                                    <div className="sidebar-wrapper">
                                        <Nav style={{ textAlign: "right", display: "block", padding: '0px' }}>
                                            <li style={{ textAlign: "center" }}>
                                                <h3></h3>
                                            </li>
                                            <li style={{ textAlign: "center" }}>
                                                <NavLink to="/dashboard" style={{}}>
                                                    <img src={soldier} style={{ height: "10rem" }}></img>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/dashboard">
                                                    <div style={{ textAlign: "center" }}>
                                                        <h4 style={{ fontWeight: "bold", fontSize: "20px", textAlign: 'center', color: 'gray' }}>
                                                            שלום, {user.name + ' ' + user.lastname}
                                                        </h4>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </Nav>
                                    </div>
                                </Col>
                                <Col lg="8" style={{padding:'0px'}}>
                                    <UserCarousel/>
                                </Col>

                                <Col lg="2" style={{ padding: "0px",textAlign:'center'}}>
                                <img src={tafkidipediashortlogo} style={{ height: "6rem" ,paddingTop:'1rem',paddingBottom:'1rem'}}></img>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : //dark mode!!!!!!!!
                    <Card style={{ borderRadius: '40px',boxShadow:"0 1px 10px 0 rgb(0 0 0 / 10%), 0 1px 10px 0 rgb(0 0 0 / 15%)",marginBottom:'10px'}}>
                        <CardBody style={{ padding: "0px" }}>
                            <Row style={{ margin: 'auto' }}>
                                <Col lg="2" style={{ padding: "0px" }}>
                                    <div className="sidebar-wrapper">
                                        <Nav style={{ textAlign: "right", display: "block", padding: '0px' }}>
                                            <li style={{ textAlign: "center" }}>
                                                <h3></h3>
                                            </li>
                                            <li style={{ textAlign: "center" }}>
                                                <NavLink to="/dashboard" style={{}}>
                                                    <img src={soldier} style={{ height: "10rem" }}></img>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/dashboard">
                                                    <li style={{ textAlign: "center" }}>
                                                        <h4 style={{ fontWeight: "bold", fontSize: "20px", textAlign: 'center', color: 'gray' }}>
                                                            שלום, {user.name + ' ' + user.lastname}
                                                        </h4>
                                                    </li>
                                                </NavLink>
                                            </li>
                                        </Nav>
                                    </div>
                                </Col>
                                <Col lg="8" style={{padding: "0px"}}>
                                <UserCarousel/>
                                </Col>

                                <Col lg="2" style={{ padding: "0px",textAlign:'center'}}>
                                <img src={tafkidipediashortlogo} style={{ height: "6rem",paddingTop:'1rem',paddingBottom:'1rem'}}></img>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
            )}
        </ThemeContext.Consumer>
    );
};

export default UserCard;
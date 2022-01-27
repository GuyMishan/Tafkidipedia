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
import { signin, authenticate, isAuthenticated } from 'auth/index';

import UserInfoCardGeneral from './UserInfoCardGeneral';
import UserInfoCardPicture from './UserInfoCardPicture';
import UserInfoCardSigli from './UserInfoCardSigli';
import UserInfoCardExtra from './UserInfoCardExtra';

function ProfilePage({ match }) {
  //user
  const [user, setUser] = useState(undefined)
  //user

  async function loaduser() {
    let res = await axios.post(`http://localhost:8000/api/getuserbyid`,{userid:match.params.userid});
    let tempuser = res.data;
    setUser(tempuser)
}

  function init() {
    loaduser()
  }

  useEffect(() => {
    init();
  }, [])

    return (
      user? 
        <div>
            <Row>
                <Col xs={12} md={9}>
                <UserInfoCardGeneral user={user}/>

                <UserInfoCardSigli user={user}/>

                <UserInfoCardExtra user={user}/>
                </Col>

                <Col xs={12} md={3}>
                <UserInfoCardPicture user={user}/>
                </Col>
            </Row>
        </div>:null
    );
}

export default withRouter(ProfilePage);
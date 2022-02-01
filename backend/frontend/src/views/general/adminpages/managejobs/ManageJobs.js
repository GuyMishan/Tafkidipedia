import React, { useState, useEffect } from 'react';
import { withRouter, Redirect, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Container,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import ManageJobsSortingTable from 'views/general/adminpages/managejobs/ManageJobsSortingTable/SortingTable'

const ManageJobs = (props) => {

  return (
    <div dir='rtl' className="">
      <Card>
        <CardHeader style={{ textAlign: 'right' }}>
          <h3 style={{fontWeight:'bold'}}>תפקידים במערכת</h3>
        </CardHeader>
        <CardBody>
          <ManageJobsSortingTable theme={props.theme} />
        </CardBody>
      </Card>
    </div>
  );
}
export default withRouter(ManageJobs);;


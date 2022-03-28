import React, { useState } from "react";

import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Modal,
  NavbarToggler,
  ModalHeader,
  Card,
  CardBody
} from "reactstrap";

const SegelMessage = (props) => {
  return (
    <Card>
      <CardBody>
        <div style={{ textAlign: 'right' }}>
          <h2>הודעות סגליות</h2>
        </div>
      </CardBody>
    </Card>
  );
};

export default SegelMessage;
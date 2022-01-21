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

function UserInfoCardGeneral(props) {

    return (
        <Card>
            <CardHeader>
                <h2 style={{ textAlign: 'right', fontWeight: 'bold' }}>פרטים אישיים</h2>
            </CardHeader>
            <CardBody>
                <Container>
                    <Row>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>גיל:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מגורים:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מצב משפחתי:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>השכלה:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תת"ש נוכחי:</h4>
                        </Col>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>וותק בדרגה:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>וותק בקבע:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מודל שירות:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תנועה 2022:</h4>
                        </Col>
                    </Row>

                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardGeneral);
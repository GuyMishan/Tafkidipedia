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

function UserInfoCardExtra(props) {

    return (
        <Card>
            <CardHeader>
                <h2 style={{ textAlign: 'right', fontWeight: 'bold' }}>פרטים נוספים</h2>
            </CardHeader>
            <CardBody>
                <Container>
                    <Row>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>הצטיינות (תא"ל ומעלה):</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>עיין תיק:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>מצ"ח:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תלונות (3 שנים אחרונות):</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>תמריץ בשלוש שנים אחרונות:</h4>
                        </Col>
                        <Col>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>ציון מ"ה:</h4>
                            <h4 style={{ textAlign: 'right', fontWeight: 'bold' }}>סיווג:</h4>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
}

export default withRouter(UserInfoCardExtra);
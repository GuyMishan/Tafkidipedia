import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
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
    Collapse
} from "reactstrap";
import axios from 'axios'
import MahzorFormUserAnimatedMultiSelect from "../Select/MahzorFormUserAnimatedMultiSelect";

const MahzorFormFilter = (props) => {
    const [movements, setMovements] = useState([])

    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    const getMovements = async () => {
        let tempmovements = [];
        let result = await axios.get(`http://localhost:8000/api/movement`)
        tempmovements = result.data;
        setMovements(tempmovements)
    }

    function init() {
        getMovements();
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Row dir='rtl'>
                <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                    <Button onClick={toggleCollapse} style={{}}>סינון</Button>
                </Col>
                <Col xs={12} md={11} style={{ textAlign: 'right', margin: 'auto' }}>
                    <div dir='rtl' style={{ width: '70%', margin: 'auto' }}>
                        <MahzorFormUserAnimatedMultiSelect data={props.candidatestoshow} handle_change={props.handle_change_candidate_name} placeholder={"בחר מתמודד"} />
                    </div>
                </Col>
            </Row>

            <Collapse isOpen={collapseOpen}>
                <Card style={{ background: 'rgb(228,228,228,0.2)' }}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>

                        </Col>
                        <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>תנועה</h4>
                            {movements ? movements.map((movement, index) => {
                                {
                                    return (
                                        <div style={{}}>
                                            {props.candidatefilter.movementfilter && props.candidatefilter.movementfilter.indexOf(movement._id) != -1 ?
                                                <button className="btn-empty" name={'movement'} value={movement._id} onClick={props.setfilter}><h6 style={{ color: 'blue', }}>{movement.name}</h6></button>
                                                : <button className="btn-empty" name={'movement'} value={movement._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{movement.name}</h6></button>}
                                        </div>
                                    )
                                }
                            }) : null}
                        </Col>
                    </Row>
                </Card >
            </Collapse>
        </div>
    );
}
export default withRouter(MahzorFormFilter);;
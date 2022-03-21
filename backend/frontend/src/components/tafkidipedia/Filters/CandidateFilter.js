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

const CandidateFilter = (props) => {

    const [migzars, setMigzars] = useState([])

    const [movements, setMovements] = useState([])

    const [units, setUnits] = useState([])

    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    const getUnits = async () => {
        let tempunits = [];
        let result = await axios.get(`http://localhost:8000/api/unit`)
        tempunits = result.data;
        setUnits(tempunits)
    }

    const getMovements = async () => {
        let tempmovements = [];
        let result = await axios.get(`http://localhost:8000/api/movement`)
        tempmovements = result.data;
        setMovements(tempmovements)
    }

    const getMigzars = async () => {
        let tempmigzars = [];
        tempmigzars.push('מכונות');
        tempmigzars.push('תו"ן');
        tempmigzars.push('חשמל');
        tempmigzars.push('ורסטילי');
        setMigzars(tempmigzars)
    }

    function init() {
        getMovements();
        getUnits();
        getMigzars();
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{ }}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{ background: 'linear-gradient(0deg, rgb(228 228 228) 0%, rgb(255 255 255) 100%)' }}>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>מגזר</h4>
                            {migzars ? migzars.map((migzar, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.candidatefilter.migzarfilter && props.candidatefilter.migzarfilter.indexOf(migzar) != -1 ?
                                                <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{migzar}</h6></button>
                                                : <button className="btn-empty" name={'migzar'} value={migzar} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{migzar}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>יחידה</h4>
                            {units ? units.map((unit, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.candidatefilter.unitfilter && props.candidatefilter.unitfilter.indexOf(unit._id) != -1 ?
                                                <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ color: 'blue' }}>{unit.name}</h6></button>
                                                : <button className="btn-empty" name={'unit'} value={unit._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{unit.name}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={4} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>תנועה</h4>
                            {movements ? movements.map((movement, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.candidatefilter.movementfilter && props.candidatefilter.movementfilter.indexOf(movement._id) != -1 ?
                                                <button className="btn-empty" name={'movement'} value={movement._id} onClick={props.setfilter}><h6 style={{ color: 'blue', }}>{movement.name}</h6></button>
                                                : <button className="btn-empty" name={'movement'} value={movement._id} onClick={props.setfilter}><h6 style={{ fontWeight: 'unset' }}>{movement.name}</h6></button>}
                                        </Row>
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
export default withRouter(CandidateFilter);;
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
import SortingTable from 'components/tafkidipedia/EshkolByMahzorSortingTable/SortingTable';

function DisplayMahzorEshkol({ match }) {
    const [count, setCount] = useState(0); //to refresh table...

    //candidatespreferences
    //const [candidatespreferences, setCandidatesPreferences] = useState({})
    //candidatespreferences

    //mahzoreshkol
    // const [mahzoreshkol, setMahzorEshkol] = useState({})
    //mahzoreshkol

    async function CalculateMahzorEshkol() {
        //delete all eshkols of certain mahzor
        let response1 = await axios.delete(`http://localhost:8000/api/eshkol/deletemahzoreshkol/${match.params.mahzorid}`)
        let tempdata = response1.data;
        // console.log(tempdata)

        let tempmahzoreshkol = [];// final result

        //get all jobs of mahzor
        let response2 = await axios.get(`http://localhost:8000/api/jobsbymahzorid/${match.params.mahzorid}`)
        let tempmahzorjobs = response2.data;
        console.log(tempmahzorjobs)

        //get all candidatepreferences of mahzor
        let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;
        for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
            for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
                let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
                tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
                delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
                delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
            }
            for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
                let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
                tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
                delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
                delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
            }
        }
        console.log(tempcandidatespreferencesdata)

        //get all unitpreferences of mahzor
        let response4 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
        let tempunitspreferences = response4.data;
        console.log(tempunitspreferences)

        //calculate eshkols!!!!
        for (let i = 0; i < tempmahzorjobs.length; i++) {
            tempmahzoreshkol[i] = ({ mahzor: match.params.mahzorid, job: tempmahzorjobs[i]._id, finalconfirmation: false, candidatesineshkol: [] })
            for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
                for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                    if (tempcandidatespreferencesdata[j].certjobpreferences[k].job == tempmahzorjobs[i]._id) {
                        tempmahzoreshkol[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
                    }
                }
                for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                    if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].job == tempmahzorjobs[i]._id) {
                        tempmahzoreshkol[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
                    }
                }
            }
        }

        for (let i = 0; i < tempmahzoreshkol.length; i++) {
            for (let j = 0; j < tempunitspreferences.length; j++) {
                if (tempunitspreferences[j].job._id == tempmahzoreshkol[i].job) {
                    for (let k = 0; k < tempunitspreferences[j].preferencerankings.length; k++) {
                        for (let l = 0; l < tempmahzoreshkol[i].candidatesineshkol.length; l++) {
                            if(tempmahzoreshkol[i].candidatesineshkol[l].candidate==tempunitspreferences[j].preferencerankings[k].candidate)
                            {
                                tempmahzoreshkol[i].candidatesineshkol[l].unitrank =tempunitspreferences[j].preferencerankings[k].rank;
                            }
                        }
                    }
                }
            }
        }
        console.log(tempmahzoreshkol)


        // //post mahzor eshkols to db
        // for (let i = 0; i < tempmahzoreshkol.length; i++) {
        //     let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol[i])
        //     // let tempdata = response1.data;
        // }
        // setCount(count + 1);
    }

    function init() {

    }

    useEffect(() => {
        init();
    }, [])

    return (
        <Container>
            <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת אשכולות</h3>
            <SortingTable mahzorid={match.params.mahzorid} refresh={count} />
            <Button onClick={() => CalculateMahzorEshkol()}>חשב אשכולות</Button>
        </Container>
    );
}

export default withRouter(DisplayMahzorEshkol);
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

import PanelHeader from "components/general/PanelHeader/PanelHeader";

import MahzorCandidatesPreferencesSortingTable from 'components/tafkidipedia/MahzorCandidatesPreferencesSortingTable/SortingTable'
import MahzorUnitsPreferencesSortingTable from 'components/tafkidipedia/MahzorUnitsPreferencesSortingTable/SortingTable'

import MahzorFinalUnitsPreferencesSortingTable from 'components/tafkidipedia/MahzorFinalUnitsPreferencesSortingTable/SortingTable'
import MahzorFinalCandidatesPreferencesSortingTable from 'components/tafkidipedia/MahzorFinalCandidatesPreferencesSortingTable/SortingTable'
import MahzorCandidatesWithoutPreferencesSortingTable from 'components/tafkidipedia/MahzorCandidatesWithoutPreferencesSortingTable/SortingTable'
import MahzorCandidatesWithoutFinalPreferencesSortingTable from 'components/tafkidipedia/MahzorCandidatesWithoutFinalPreferencesSortingTable/SortingTable'

import DisplayMahzorEshkol from './DisplayMahzorEshkol';
import DisplayMahzorFinalEshkol from './DisplayMahzorFinalEshkol';

function DisplayMahzor({ match }) {
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  //mahzor

  const loadmahzor = () => {
    axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        // tempmahzor.startdate = tempmahzor.startdate.slice(0, 10);
        // tempmahzor.enddate = tempmahzor.enddate.slice(0, 10);
        setMahzorData(tempmahzor);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function init() {
    loadmahzor()
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div style={{width:'95%'}}>
      <PanelHeader size="sm" content={
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{(mahzordata.name)+ " - "}</h1>
          {mahzordata.status == 1 ?
            <>
               <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת מחזור חדש</h1>
            </> :
            mahzordata.status == 2 ?
              <>
                 <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת סבב העדפות ראשון</h1>
              </> :
              mahzordata.status == 3 ?
                <>
                   <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>סיום סבב העדפות ראשון</h1>
                </> :
                mahzordata.status == 4 ?
                  <>
                     <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>התחלת סבב העדפות שני (לאחר ראיונות)</h1>
                  </> :
                  mahzordata.status == 5 ?
                    <>
                       <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>שיבוצים סופיים</h1>
                    </> : 
                    mahzordata.status == 6 ?
                    <>
                       <h1 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>מחזור סגור</h1>
                    </> : null}
        </Container>} />

      {mahzordata.status == 3 ?
        <Card style={{ marginTop: '30px' }}>
          <CardBody>
            <DisplayMahzorEshkol />
          </CardBody>
        </Card> : null}

      {mahzordata.status == 2 || mahzordata.status == 3 ?
        <>
          <Card style={{ marginTop: '30px' }}>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת העדפות מועמדים</h3>
              <MahzorCandidatesPreferencesSortingTable />
            </CardBody>
          </Card>

          <Card style={{ marginTop: '30px' }}>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת מועמדים שלא מילאו העדפה</h3>
              <MahzorCandidatesWithoutPreferencesSortingTable />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת העדפות יחידות</h3>
              <MahzorUnitsPreferencesSortingTable />
            </CardBody>
          </Card>
        </> : null}

      {mahzordata.status == 5 ?
        <Card style={{ marginTop: '30px' }}>
          <CardBody>
            <DisplayMahzorFinalEshkol editable={true} mahzorid={match.params.mahzorid}/>
          </CardBody>
        </Card> : null}

        {mahzordata.status == 6 ?
        <Card style={{ marginTop: '30px' }}>
          <CardBody>
            <DisplayMahzorFinalEshkol editable={false} mahzorid={match.params.mahzorid}/>
          </CardBody>
        </Card> : null}

      {mahzordata.status == 4 || mahzordata.status == 5 || mahzordata.status == 6 ?
        <>
          <Card style={{ marginTop: '30px' }}>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת העדפות מועמדים - לאחר ראיונות</h3>
              <MahzorFinalCandidatesPreferencesSortingTable />
            </CardBody>
          </Card>

          <Card style={{ marginTop: '30px' }}>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת מועמדים שלא מילאו העדפה</h3>
              <MahzorCandidatesWithoutFinalPreferencesSortingTable />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 style={{ textAlign: 'right', fontWeight: 'bold' }}>טבלת העדפות יחידות - לאחר ראיונות</h3>
              <MahzorFinalUnitsPreferencesSortingTable />
            </CardBody>
          </Card>
        </> : null}

      <Link to={`/mahzorform/${mahzordata._id}`}><Button>ערוך מחזור</Button></Link>
    </div>
  );
}

export default withRouter(DisplayMahzor);
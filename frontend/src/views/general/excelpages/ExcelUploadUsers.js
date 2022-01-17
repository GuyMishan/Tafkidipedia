import React, { Component } from "react";
import { Table, Button, Popconfirm, Row, Col, Icon, Upload } from "antd";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../../../../utils/workplan/EditTable";
import axios from 'axios'

export default class ExcelUploadUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      columns: [
        {
          title: "Designation",
          dataIndex: "Designation",
          editable: true
        },
        {
          title: "Designation_des",
          dataIndex: "Designation_des",
          editable: true
        },
        {
          title: "birthdate",
          dataIndex: "birthdate",
          editable: true
        },
        {
          title: "call_number",
          dataIndex: "call_number",
          editable: true
        },
        {
          title: "frequency",
          dataIndex: "frequency",
          editable: true
        },
        {
          title: "frq_unit",
          dataIndex: "frq_unit",
          editable: true
        },
        {
          title: "hativa",
          dataIndex: "hativa",
          editable: true
        },
        {
          title: "hativa_des",
          dataIndex: "hativa_des",
          editable: true
        },
        {
          title: "hierarchy",
          dataIndex: "hierarchy",
          editable: true
        },
        {
          title: "last_treatment_date",
          dataIndex: "last_treatment_date",
          editable: true
        },
        {
          title: "lower_tolerance",
          dataIndex: "lower_tolerance",
          editable: true
        },
        {
          title: "maamad",
          dataIndex: "maamad",
          editable: true
        },
        {
          title: "maamad_des",
          dataIndex: "maamad_des",
          editable: true
        },
        {
          title: "makat",
          dataIndex: "makat",
          editable: true
        },
        {
          title: "makat_des",
          dataIndex: "makat_des",
          editable: true
        }, 
        {
          title: "meaged",
          dataIndex: "meaged",
          editable: true
        }, 
        {
          title: "meaged_al",
          dataIndex: "meaged_al",
          editable: true
        }, 
        {
          title: "meaged_al_des",
          dataIndex: "meaged_al_des",
          editable: true
        }, 
        {
          title: "meaged_des",
          dataIndex: "meaged_des",
          editable: true
        }, 
        {
          title: "mekabete",
          dataIndex: "mekabete",
          editable: true
        }, 
        {
          title: "mekabete_des",
          dataIndex: "mekabete_des",
          editable: true
        }, 
        {
          title: "message_date",
          dataIndex: "message_date",
          editable: true
        }, 
        {
          title: "message_num",
          dataIndex: "message_num",
          editable: true
        }, 
        {
          title: "message_treatment",
          dataIndex: "message_treatment",
          editable: true
        }, 
        {
          title: "message_treatment_des",
          dataIndex: "message_treatment_des",
          editable: true
        }, 
        {
          title: "order_number",
          dataIndex: "order_number",
          editable: true
        },
        
        {
          title: "pikud",
          dataIndex: "pikud",
          editable: true
        },
        
        {
          title: "pikud_des",
          dataIndex: "pikud_des",
          editable: true
        }, 
        {
          title: "plan_number",
          dataIndex: "plan_number",
          editable: true
        }, 
        {
          title: "planning_date",
          dataIndex: "planning_date",
          editable: true
        }, 
        {
          title: "policy",
          dataIndex: "policy",
          editable: true
        }, 
        {
          title: "policy_category",
          dataIndex: "policy_category",
          editable: true
        }, 
        {
          title: "policy_des",
          dataIndex: "policy_des",
          editable: true
        }, 
        {
          title: "policy_treatment",
          dataIndex: "policy_treatment",
          editable: true
        }, 
        {
          title: "policy_treatment_des",
          dataIndex: "policy_treatment_des",
          editable: true
        }, 
        {
          title: "type_of_treatment_performed",
          dataIndex: "type_of_treatment_performed",
          editable: true
        },
        
        {
          title: "type_of_treatment_performed_des",
          dataIndex: "type_of_treatment_performed_des",
          editable: true
        }, 
        {
          title: "ugda",
          dataIndex: "ugda",
          editable: true
        }, 
        {
          title: "ugda_des",
          dataIndex: "ugda_des",
          editable: true
        }, 
        {
          title: "unit",
          dataIndex: "unit",
          editable: true
        }, 
        {
          title: "unit_des",
          dataIndex: "unit_des",
          editable: true
        }, 
        {
          title: "upper_tolerance",
          dataIndex: "upper_tolerance",
          editable: true
        }, 
        {
          title: "work_center",
          dataIndex: "work_center",
          editable: true
        }, 
        {
          title: "work_center_des",
          dataIndex: "work_center_des",
          editable: true
        }, 
        {
          title: "work_site",
          dataIndex: "work_site",
          editable: true
        },
        
        {
          title: "zadik",
          dataIndex: "zadik",
          editable: true
        }, 
        {
          title: "zadik_des",
          dataIndex: "zadik_des",
          editable: true
        }
      ]
    };
  }

  handleSave = row => {
    const newData = [...this.state.rows];

    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };

  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  }

  fileHandler = fileList => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              // key: index,
              Designation: row[0],
              Designation_des: row[1],
              birthdate: row[3],
              call_number: row[4],
              frequency: row[5],
              frq_unit: row[6],
              hativa: row[7],
              hativa_des: row[8],
              hierarchy: row[9],
              last_treatment_date: row[10],
              lower_tolerance: row[11],
              maamad: row[12],
              maamad_des: row[13],
              makat: row[14],
              makat_des: row[15],
              meaged: row[16],
              meaged_al: row[17],
              meaged_al_des: row[18],
              meaged_des: row[19],
              mekabete: row[20],
              mekabete_des: row[21],
              message_date: row[22],
              message_num: row[23],
              message_treatment: row[24],
              message_treatment_des: row[25],
              order_number: row[26],
              pikud: row[27],
              pikud_des: row[28],
              plan_number: row[29],
              planning_date: row[30],
              policy: row[31],
              policy_category: row[32],
              policy_des: row[33],
              policy_treatment: row[34],
              policy_treatment_des: row[35],
              type_of_treatment_performed: row[36],
              type_of_treatment_performed_des: row[37],
              ugda: row[38],
              ugda_des: row[39],
              unit: row[40],
              unit_des: row[41],
              upper_tolerance: row[42],
              work_center: row[43],
              work_center_des: row[44],
              work_site: row[45],
              zadik: row[46],
              zadik_des: row[47],
            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!"
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null
          });
        }
      }
    });
    return false;
  };

  handleSubmit = async () => {


    console.log("submitting: ", this.state.rows);

    const data = this.state.rows

    data.map(row => {
      const Designation= row.Designation
      const Designation_des= row.Designation_des
      const birthdate= row.birthdate
      const call_number= row.call_number
      const frequency= row.frequency
      const frq_unit= row.frq_unit
      const hativa= row.hativa
      const hativa_des= row.hativa_des
      const hierarchy= row.hierarchy
      const last_treatment_date= row.last_treatment_date
      const lower_tolerance= row.lower_tolerance
      const maamad= row.maamad
      const maamad_des= row.maamad_des
      const makat= row.makat
      const makat_des= row.makat_des
      const meaged= row.meaged
      const meaged_al= row.meaged_al
      const meaged_al_des= row.meaged_al_des
      const meaged_des= row.meaged_des
      const mekabete= row.mekabete
      const mekabete_des= row.mekabete_des
      const message_date= row.message_date
      const message_num= row.message_num
      const message_treatment= row.message_treatment
      const message_treatment_des= row.message_treatment_des
      const order_number= row.order_number
      const pikud= row.pikud
      const pikud_des= row.pikud_des
      const plan_number= row.plan_number
      const planning_date= row.planning_date
      const policy= row.policy
      const policy_category= row.policy_category
      const policy_des= row.policy_des
      const policy_treatment= row.policy_treatment
      const policy_treatment_des= row.policy_treatment_des
      const type_of_treatment_performed= row.type_of_treatment_performed
      const type_of_treatment_performed_des= row.type_of_treatment_performed_des
      const ugda= row.ugda
      const ugda_des= row.ugda_des
      const unit= row.unit
      const unit_des= row.unit_des
      const upper_tolerance= row.upper_tolerance
      const work_center= row.work_center
      const work_center_des= row.work_center_des
      const work_site= row.work_site
      const zadik= row.zadik
      const zadik_des= row.zadik_des

      axios.post('http://localhost:8000/api/nexttreat', { Designation, Designation_des,birthdate ,call_number ,frequency ,frq_unit ,hativa ,hativa_des ,hierarchy ,last_treatment_date ,lower_tolerance,maamad,maamad_des,makat,makat_des,meaged,meaged_al,meaged_al_des,meaged_des,mekabete,mekabete_des,message_date
      ,message_num,message_treatment,message_treatment_des,order_number,pikud,pikud_des,plan_number,planning_date,policy,policy_category,policy_des,policy_treatment,policy_treatment_des,type_of_treatment_performed,type_of_treatment_performed_des,ugda,ugda_des,unit,unit_des
      ,upper_tolerance,work_center,work_center_des,work_site,zadik,zadik_des})
        .then(function (response) {
          console.log(response);

        })
        .catch(function (error) {
          console.log(error);
        });
    })

    //submit to API
    //if successful, banigate and clear the data
    //this.setState({ rows: [] })
  };

  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count,
      name: "User's name",
      age: "22",
      gender: "Female"
    };
    this.setState({
      rows: [newData, ...rows],
      count: count + 1
    });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <>
        <h1 style={{ textAlign: 'center' }}>users-העלת קבצי אקסל</h1>
        <Row gutter={16}>
          <Col
            span={8}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>

            </div>
          </Col>
          <Col span={8}>
            <a
              href="https://res.cloudinary.com/bryta/raw/upload/v1562751445/Sample_Excel_Sheet_muxx6s.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              download
            >

            </a>
          </Col>
          <Col
            span={8}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <>
                <Button
                  onClick={this.handleAdd}
                  size="large"
                  type="info"
                  style={{ marginBottom: 16 }}
                >
                  <Icon type="plus" />
                  Add a row
                </Button>{" "}
                <Button
                  onClick={this.handleSubmit}
                  size="large"
                  type="primary"
                  style={{ marginBottom: 16, marginLeft: 10 }}
                >
                  העלה קובץ
                </Button>
              </>
            )}
          </Col>
        </Row>
        <div>
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
            <Button style={{ float: 'right', marginBottom: '15px' }}>
              <Icon type="upload" /> לחץ להעלת טבלת אקסל
            </Button>
          </Upload>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="table-responsive">
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div>
        </div>
      </>
    );
  }
}
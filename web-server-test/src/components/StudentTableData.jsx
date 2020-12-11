import React from "react";
import StudentTableElement from "./StudentTableElement";
import { Table, Col } from "react-bootstrap";

function StudentTableData(props) {
  const [allStudents, setAllStudents] = React.useState([]);

  const fetchAllData = async () => {
    try {
      const response = await fetch("http://localhost:3001/students/", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setAllStudents(data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <Col xs={11}>
      <div className="dashboard-panel">
        <h4 className="font-weight-bold text-left">All Students</h4>
        <Table striped bordered hover size="sm" className="student-data-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.map((student, index) => (
              <StudentTableElement key={index} index={index} student={student} getEditID={props.getEditID} />
            ))}
          </tbody>
        </Table>
      </div>
    </Col>
  );
}

export default StudentTableData;

import React from "react";
import { Col, Button } from "react-bootstrap";

function DeleteStudent() {
  const [studentID, setStudentID] = React.useState("");

  const deleteStudentHandler = async () => {
    try {
      await fetch(`http://localhost:3001/students/${studentID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setStudentID("");
    } catch (e) {
      console.log(e);
    }
  };

  const updateInputHandler = (event) => {
    setStudentID(event.target.value);
  };

  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left">
        <h4 className="font-weight-bold">Delete Student</h4>
        <input type="text" placeholder="Enter student ID..." value={studentID} onChange={updateInputHandler} />
        <Button onClick={deleteStudentHandler} variant="danger">
          Submit
        </Button>
      </div>
    </Col>
  );
}

export default DeleteStudent;

import React from "react";
import { Col, Button } from "react-bootstrap";

function GetAllStudents() {
  const fetchAllStudents = async () => {
    try {
      const response = await fetch("http://localhost:3001/students/", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left">
        <h4 className="font-weight-bold">Get all students</h4>
        <Button onClick={fetchAllStudents}>Fetch students</Button>
      </div>
    </Col>
  );
}

export default GetAllStudents;

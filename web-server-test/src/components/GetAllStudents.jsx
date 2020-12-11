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
    <div className="dashboard-panel-small text-left">
      <h4 className="font-weight-bold">Get all students</h4>
      <Button onClick={fetchAllStudents}>Fetch students</Button>
    </div>
  );
}

export default GetAllStudents;

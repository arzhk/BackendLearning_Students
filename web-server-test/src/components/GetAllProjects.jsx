import React from "react";
import { Col, Button } from "react-bootstrap";

function GetAllProjects() {
  const fetchAllProjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/projects/", {
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
      <h4 className="font-weight-bold">Get all projects</h4>
      <Button onClick={fetchAllProjects}>Fetch projects</Button>
    </div>
  );
}

export default GetAllProjects;

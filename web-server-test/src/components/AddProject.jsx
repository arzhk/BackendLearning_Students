import React from "react";
import { Col, Button } from "react-bootstrap";

function AddProject() {
  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left coming-soon">
        <h4 className="font-weight-bold">Add project</h4>
        <input className="d-block" type="text" placeholder="Project name..." />
        <input className="d-block" type="text" placeholder="Description..." />
        <input className="d-block" type="text" placeholder="Repo Url..." />
        <input className="d-block" type="text" placeholder="Live Url..." />
        <input className="d-block" type="text" placeholder="Student ID..." />
        <Button variant="success" className="d-block">
          Submit
        </Button>
      </div>
    </Col>
  );
}

export default AddProject;

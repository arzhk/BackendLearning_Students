import React from "react";
import { Col, Button } from "react-bootstrap";

function DeleteProject() {
  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left coming-soon">
        <h4 className="font-weight-bold">Delete project</h4>
        <input type="text" placeholder="Enter project ID..." />
        <Button variant="danger">Submit</Button>
      </div>
    </Col>
  );
}

export default DeleteProject;

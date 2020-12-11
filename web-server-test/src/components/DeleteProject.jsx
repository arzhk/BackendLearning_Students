import React from "react";
import { Col, Button } from "react-bootstrap";

function DeleteProject() {
  return (
    <div className="dashboard-panel-small text-left coming-soon mb-3">
      <h4 className="font-weight-bold">Delete project</h4>
      <input type="text" placeholder="Enter project ID..." />
      <Button variant="danger">Submit</Button>
    </div>
  );
}

export default DeleteProject;

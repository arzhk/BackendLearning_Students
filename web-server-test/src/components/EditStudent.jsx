import React from "react";
import { Col, Button } from "react-bootstrap";

function EditStudent() {
  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left coming-soon" disabled>
        <h4 className="font-weight-bold" disabled>
          Edit student info
        </h4>
        <input className="d-block" type="text" placeholder="First name..." disabled />
        <input className="d-block" type="text" placeholder="Surname..." disabled />
        <input className="d-block" type="email" placeholder="Email address..." disabled />
        <input className="d-block" type="date" placeholder="Date of birth..." disabled />
        <Button variant="warning" className="d-block" disabled>
          Submit
        </Button>
      </div>
    </Col>
  );
}

export default EditStudent;

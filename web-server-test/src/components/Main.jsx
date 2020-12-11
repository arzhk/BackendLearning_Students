import React from "react";
import { Container, Row, Alert, Col } from "react-bootstrap";
import AddProject from "./AddProject";
import AddStudent from "./AddStudent";
import DeleteStudent from "./DeleteStudent";
import DeleteProject from "./DeleteProject";
import EditProject from "./EditProject";
import EditStudent from "./EditStudent";
import GetAllStudents from "./GetAllStudents";
import GetAllProjects from "./GetAllProjects";
import StudentTableData from "./StudentTableData";

function Main() {
  const [showError, setShowError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("error message");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [successText, setSuccessText] = React.useState(false);
  const [editID, setEditID] = React.useState("");

  const getErrorMessage = (error, shouldShow) => {
    setShowError(shouldShow);
    setErrorText(error);
  };

  const getSuccessMessage = (success, shouldShow) => {
    setShowSuccess(shouldShow);
    setSuccessText(success);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  const getEditID = (id) => {
    setEditID(id);
  };

  return (
    <div id="main-container">
      {showError && (
        <Alert variant="danger" className="swing-in-top-fwd font-weight-bold">
          Error: <span className="font-weight-normal">{errorText}</span>
        </Alert>
      )}
      {showSuccess && (
        <Alert variant="success" className="swing-in-top-fwd font-weight-bold">
          {successText}
        </Alert>
      )}

      <h1>Test Web Server</h1>
      <Container className="mt-5" fluid>
        <h6 className="w-50 mx-auto mb-4 endpoint-title">STUDENT ENDPOINT</h6>
        <Row className="justify-content-center mb-5">
          <AddStudent getError={getErrorMessage} getSuccess={getSuccessMessage} />
          <EditStudent getError={getErrorMessage} getSuccess={getSuccessMessage} editID={editID} />
          <Col xs={3}>
            <DeleteStudent />
            <GetAllStudents />
          </Col>
          <StudentTableData getEditID={getEditID} />
        </Row>
        <h6 className="w-50 mx-auto mb-4 endpoint-title">PROJECT ENDPOINT</h6>
        <Row className="justify-content-center mb-5">
          <AddProject />
          <EditProject />
          <Col xs={3}>
            <DeleteProject />
            <GetAllProjects />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Main;

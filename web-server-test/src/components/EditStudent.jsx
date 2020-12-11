import React from "react";
import { useEffect } from "react";
import { Col, Button } from "react-bootstrap";

function EditStudent(props) {
  const [idInput, setIdInput] = React.useState("");
  const [newData, setNewData] = React.useState({
    name: "",
    surname: "",
    email: "",
    dob: "",
    _studentId: "",
  });

  const [enableDataEntry, setEnableDataEntry] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("ID must be 17 characters long");

  const putDataHandler = async () => {
    try {
      if (errorMessage === "Student Found") {
        const data = await fetch(`http://localhost:3001/students/${idInput}`, {
          method: "PUT",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (data.ok) {
          props.getError("", false);
          props.getSuccess("Student data successfully updated", true);
          setIdInput("");
          window.location.reload();
        } else {
          props.getSuccess("", false);
          props.getError("Cannot enter duplicate email.", true);
        }
      } else {
        setErrorMessage("No student found with that ID");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const idValidatorHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3001/students/${idInput}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.length > 0) {
        setNewData({
          name: data[0].name,
          surname: data[0].surname,
          email: data[0].email,
          dob: data[0].dob,
          _id: newData._studentId,
        });
        setErrorMessage("Student Found");
        setEnableDataEntry(false);
      } else {
        setErrorMessage("No student found with that ID");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateInputHandler = (event) => {
    switch (event.target.placeholder) {
      case "First name...":
        setNewData({ ...newData, name: event.target.value });
        break;
      case "Surname...":
        setNewData({ ...newData, surname: event.target.value });
        break;
      case "Email address...":
        setNewData({ ...newData, email: event.target.value });
        break;
      case "Date of birth...":
        setNewData({ ...newData, dob: event.target.value });
        break;
      case "Enter student ID...":
        setIdInput(event.target.value);
        break;
      default:
        console.log("error, input not found");
        break;
    }
  };

  React.useEffect(() => {
    if (idInput.length === 17) {
      idValidatorHandler();
    } else {
      setEnableDataEntry(true);
      setErrorMessage("Enter a valid ID (Must be 17 characters)");
    }
  }, [idInput]);

  useEffect(() => {
    setIdInput(props.editID);
  }, [props.editID]);

  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left">
        <h4 className="font-weight-bold">Edit student info</h4>

        <input
          className="d-block mb-1"
          type="text"
          placeholder="Enter student ID..."
          onChange={updateInputHandler}
          value={idInput}
        />
        <small
          className={
            errorMessage === "No student found with that ID"
              ? "swing-in-top-fwd d-block mb-4 pl-1 text-danger"
              : errorMessage === "Student Found"
              ? "swing-in-top-fwd d-block mb-4 pl-1 text-success"
              : "swing-in-top-fwd d-block mb-4 pl-1 text-secondary"
          }
        >
          {errorMessage}
        </small>

        <div
          className={
            !enableDataEntry && errorMessage !== "No student found with that ID"
              ? "swing-in-top-fwd d-block"
              : "swing-out-top-bck d-none"
          }
        >
          <input
            className="d-block"
            type="text"
            placeholder="First name..."
            onChange={updateInputHandler}
            disabled={enableDataEntry}
            value={newData.name}
          />
          <input
            className="d-block"
            type="text"
            placeholder="Surname..."
            onChange={updateInputHandler}
            disabled={enableDataEntry}
            value={newData.surname}
          />
          <input
            className="d-block"
            type="email"
            placeholder="Email address..."
            onChange={updateInputHandler}
            disabled={enableDataEntry}
            value={newData.email}
          />
          <input
            className="d-block"
            type="date"
            placeholder="Date of birth..."
            onChange={updateInputHandler}
            disabled={enableDataEntry}
            value={newData.dob}
          />
        </div>
        <Button variant="warning" className="d-block" onClick={putDataHandler}>
          Submit
        </Button>
      </div>
    </Col>
  );
}

export default EditStudent;

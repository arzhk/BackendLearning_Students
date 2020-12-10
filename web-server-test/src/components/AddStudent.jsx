import React from "react";
import { Col, Button } from "react-bootstrap";

function AddStudent(props) {
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState("");

  const postDataHandler = async () => {
    const newStudent = {
      name: name,
      surname: surname,
      email: email,
      dob: dob,
    };

    try {
      const data = await fetch("http://localhost:3001/students/", {
        method: "POST",
        body: JSON.stringify(newStudent),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setName("");
      setSurname("");
      setEmail("");
      setDob("");
      if (data.ok) {
        props.getError("", false);
        props.getSuccess("New student sucessfully added", true);
      } else {
        props.getSuccess("", false);
        props.getError("cannot enter duplicate email.", true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateInputHandler = (event) => {
    switch (event.target.placeholder) {
      case "First name...":
        setName(event.target.value);
        break;
      case "Surname...":
        setSurname(event.target.value);
        break;
      case "Email address...":
        setEmail(event.target.value);
        break;
      case "Date of birth...":
        setDob(event.target.value);
        break;
      default:
        console.log("error, input not found");
        break;
    }
  };

  return (
    <Col xs={3} className="mb-3">
      <div className="dashboard-panel text-left">
        <h4 className="font-weight-bold">Add student</h4>
        <input className="d-block" type="text" placeholder="First name..." value={name} onChange={updateInputHandler} />
        <input className="d-block" type="text" placeholder="Surname..." value={surname} onChange={updateInputHandler} />
        <input
          className="d-block"
          type="email"
          placeholder="Email address..."
          value={email}
          onChange={updateInputHandler}
        />
        <input
          className="d-block"
          type="date"
          placeholder="Date of birth..."
          value={dob}
          onChange={updateInputHandler}
        />
        <Button variant="success" className="d-block" onClick={postDataHandler}>
          Submit
        </Button>
      </div>
    </Col>
  );
}

export default AddStudent;

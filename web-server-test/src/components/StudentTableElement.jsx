import React from "react";
import { Button } from "react-bootstrap";

function StudentTableElement(props) {
  const elementID = props.student._id;

  const deleteStudentHandler = async () => {
    try {
      await fetch(`http://localhost:3001/students/${elementID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const editIDHandler = () => {
    props.getEditID(elementID);
  };

  return (
    <tr>
      <td>{props.index}</td>
      <td>{props.student.name}</td>
      <td>{props.student.surname}</td>
      <td className="id">{props.student._id}</td>
      <td>{props.student.email}</td>
      <td>{props.student.dob}</td>
      <td>
        <Button variant="warning" className="mr-2 rounded-pill" onClick={editIDHandler}>
          <i className="far fa-edit mr-1"></i>Edit
        </Button>
        <Button variant="danger" className="mr-2 rounded-pill" onClick={deleteStudentHandler}>
          <i className="far fa-trash-alt mr-1"></i>Delete
        </Button>
        <Button variant="success" className="mr-2 rounded-pill">
          <i className="far fa-folder-open mr-1"></i> Projects
        </Button>
        <Button className="rounded-pill">
          <i className="far fa-comments mr-1"></i> Reviews
        </Button>
      </td>
    </tr>
  );
}

export default StudentTableElement;

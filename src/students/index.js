const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const readFileHandler = (filename) => {
  const targetFile = JSON.parse(fs.readFileSync(path.join(__dirname, filename)).toString());
  return targetFile;
};

const writeFileHandler = (writeToFilename, file) => {
  fs.writeFileSync(path.join(__dirname, writeToFilename), JSON.stringify(file));
};

// Get list of students
router.get("/", (req, res) => {
  const targetFile = fs.readFileSync(path.join(__dirname, "students.json")).toString();
  res.send(JSON.parse(targetFile));
});

// Get single student
router.get("/:id", (req, res) => {
  const targetFile = readFileHandler("students.json");
  const student = targetFile.filter((user) => user.ID === req.params.id);
  res.send(student);
});

// Create new student
router.post("/", (req, res) => {
  const targetFile = readFileHandler("students.json");
  const newStudent = req.body;
  if (checkDuplicateEmails(newStudent.email)) {
    newStudent._id = uniqid();
    targetFile.push(newStudent);
    fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(targetFile));
    res.status(201).send(targetFile);
  } else {
    console.log("cannot enter duplicate email");
    res.status(400).send("Cannot enter a duplicate email");
  }
});

// Edit student data
router.put("/:id", (req, res) => {
  const targetFile = readFileHandler("students.json");
  const filteredFile = targetFile.filter((user) => user._id !== req.params.id);
  const updatedStudent = req.body;
  updatedStudent._id = req.params.id;
  filteredFile.push(updatedStudent);
  fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(filteredFile));
  res.send(filteredFile);
});

// Delete student
router.delete("/:id", (req, res) => {
  const targetFile = readFileHandler("students.json");
  const filteredFile = targetFile.filter((user) => user._id !== req.params.id);
  fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(filteredFile));
  res.send(filteredFile);
});

// Get projects by student ID
router.get("/:id/projects", (req, res) => {
  const targetFile_students = readFileHandler("students.json");
  const targetFile_projects = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "/projects", "projects.json")).toString()
  );
  const filteredFile = targetFile_projects.filter((project) => project._studentId === req.params.id);
  if (filteredFile.length === 0) {
    console.log("No projects found for that Student.");
    res.send("No projects found for that Student.");
  } else {
    console.log(filteredFile);
    res.send(filteredFile);
  }
});

// Email validation

const checkDuplicateEmails = (email) => {
  const targetFile = JSON.parse(fs.readFileSync(path.join(__dirname, "students.json")).toString());
  const filteredFile = targetFile.filter((user) => user.email === email);
  return filteredFile.length === 0;
};

module.exports = router;

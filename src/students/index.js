const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const { writeFile, createReadStream } = require("fs-extra");
const { pipeline } = require("stream");
const zlib = require("zlib");
const { join } = require("path");
const e = require("express");

const router = express.Router();
const upload = multer({});

const studentImagesPath = join(__dirname, "../../public/images/students");

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
  const student = targetFile.filter((user) => user._id === req.params.id);
  console.log(student);
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

// Upload student ID photo
router.post("/:id/upload", upload.single("avatar"), async (req, res, next) => {
  try {
    const targetFile_students = readFileHandler("students.json");
    if (targetFile_students.filter((e) => e._id === req.params.id).length !== 0) {
      await writeFile(
        join(studentImagesPath, `${req.params.id}${path.extname(req.file.originalname)}`),
        req.file.buffer
      );
      const filteredFile = targetFile_students.filter((student) => student._id !== req.params.id);
      const student = targetFile_students.filter((e) => e._id === req.params.id);
      student[0].image = `${req.params.id.toString()}${path.extname(req.file.originalname.toString())}`;
      filteredFile.push(student[0]);
      fs.writeFileSync(path.join(__dirname, "students.json"), JSON.stringify(filteredFile));
      res.send("Image successfully uploaded");
    } else {
      const err = new Error();
      err.message = {
        errors: [
          {
            value: req.params.id,
            msg: "Student with that ID not found",
            param: "_studentId",
            location: "url",
          },
        ],
      };
      err.httpStatusCode = 400;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Download student ID photo
router.get("/:filename/download", (req, res, next) => {
  let source = createReadStream(join(studentImagesPath, `${req.params.filename}.jpg`));
  res.setHeader("Content-Disposition", `attachment; filename=${req.params.filename}.jpg.gz`);
  pipeline(source, zlib.createGzip(), res, (error) => next(error));
});

// Duplicate email validation
const checkDuplicateEmails = (email) => {
  const targetFile = JSON.parse(fs.readFileSync(path.join(__dirname, "students.json")).toString());
  const filteredFile = targetFile.filter((user) => user.email === email);
  return filteredFile.length === 0;
};

module.exports = router;

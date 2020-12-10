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

const router = express.Router();
const upload = multer({});

const projectImagesPath = join(__dirname, "../../public/images/projects");

const readFileHandler = (filename) => {
  const targetFile = JSON.parse(fs.readFileSync(path.join(__dirname, filename)).toString());
  return targetFile;
};

const writeFileHandler = (writeToFilename, file) => {
  fs.writeFileSync(path.join(__dirname, writeToFilename), JSON.stringify(file));
};

// Get list of projects
router.get("/", (req, res) => {
  try {
    res.send(readFileHandler("projects.json"));
  } catch (err) {
    console.log(err);
  }
});

// Get single project
router.get("/:id", (req, res) => {
  try {
    const targetFile = readFileHandler("projects.json");
    const project = targetFile.filter((project) => project._id === req.params.id);
    if (project.length > 0) {
      res.send(project);
    } else {
      res.send("No project with that ID found, please try again.");
    }
  } catch (err) {
    console.log(err);
  }
});

// Create new project
router.post(
  "/",
  [
    check("name").isLength({ min: 3 }).withMessage("Name is too short!"),
    check("description").isLength({ min: 8 }).withMessage("Description is too short!"),
    check("repoURL").isLength({ min: 5 }).withMessage("Repo Url is too short!"),
    check("liveURL").isLength({ min: 5 }).withMessage("Live Url is too short!"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const targetFile = readFileHandler("projects.json");
        const targetFile_students = JSON.parse(
          fs.readFileSync(path.join(__dirname, "..", "/students", "students.json")).toString()
        );
        const newProject = req.body;
        if (targetFile_students.filter((student) => student._id === newProject._studentId).length > 0) {
          newProject._id = uniqid();
          newProject._creationDate = new Date();
          targetFile.push(newProject);
          writeFileHandler("projects.json", targetFile);
          res.status(201).send(readFileHandler("projects.json"));
        } else {
          const err = new Error();
          err.message = {
            errors: [
              {
                value: newProject._studentId,
                msg: "Student with that ID not found",
                param: "_studentId",
                location: "body",
              },
            ],
          };
          err.httpStatusCode = 400;
          next(err);
        }
      }
    } catch (err) {
      next(err);
    }
  }
);

// Edit project data
router.put(
  "/:id",
  [
    check("name").isLength({ min: 3 }).withMessage("Name is too short!"),
    check("description").isLength({ min: 8 }).withMessage("Description is too short!"),
    check("repoURL").isLength({ min: 5 }).withMessage("Repo Url is too short!"),
    check("liveURL").isLength({ min: 5 }).withMessage("Live Url is too short!"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const targetFile = readFileHandler("projects.json");
        const filteredFile = targetFile.filter((project) => project._id !== req.params.id);
        const updatedProject = req.body;
        updatedProject._id = req.params.id;
        filteredFile.push(updatedProject);
        writeFileHandler("projects.json", filteredFile);
        res.send(filteredFile);
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// Delete student
router.delete("/:id", (req, res) => {
  try {
    const targetFile = readFileHandler("projects.json");
    const filteredFile = targetFile.filter((project) => project._id !== req.params.id);
    writeFileHandler("projects.json", filteredFile);
    res.send(filteredFile);
  } catch (err) {
    console.log(err);
  }
});

// Upload project photo
router.post("/:id/upload", upload.single("avatar"), async (req, res, next) => {
  try {
    const targetFile_projects = readFileHandler("projects.json");
    if (targetFile_projects.filter((e) => e._id === req.params.id).length !== 0) {
      await writeFile(
        join(projectImagesPath, `${req.params.id}${path.extname(req.file.originalname)}`),
        req.file.buffer
      );
      const filteredFile = targetFile_projects.filter((project) => project._id !== req.params.id);
      const project = targetFile_projects.filter((project) => project._id === req.params.id);
      project[0].image = `${req.params.id.toString()}${path.extname(req.file.originalname.toString())}`;
      filteredFile.push(project[0]);
      fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(filteredFile));
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

// Download project photo
router.get("/:filename/download", (req, res, next) => {
  let source = createReadStream(join(projectImagesPath, `${req.params.filename}.jpg`));
  res.setHeader("Content-Disposition", `attachment; filename=${req.params.filename}.jpg.gz`);
  pipeline(source, zlib.createGzip(), res, (error) => next(error));
});

module.exports = router;

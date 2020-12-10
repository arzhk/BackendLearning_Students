const express = require("express");
const { join } = require("path");
const cors = require("cors");
const studentsRoutes = require("./students");
const projectsRoutes = require("./projects");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./errorHandling");

const server = express();

const port = 3001;
const publicFolderPath = join(__dirname, "../public");

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
  next();
};

server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);
server.use(express.static(publicFolderPath));

server.use("/students", studentsRoutes);
server.use("/projects", projectsRoutes);

server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

server.listen(port, () => {
  console.log("Server is running on port: ", port);
});

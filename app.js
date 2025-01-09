// EXPRESS INIT
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.HOST_PORT;
const domain = process.env.HOST_DOMAIN;

// MIDDLEWARES
const errorHandler = require("./middlewares/errorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ROUTERS
const postsRouter = require("./routers/posts");

app.get("/", (req, res) => {
  console.log("homepage request received");
  res.send("Server del mio Blog");
});
app.use("/posts", postsRouter);

// ERROR HANDLERS
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`server listening on ${domain}:${port}`);
});

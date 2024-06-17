const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(cors()); // Move this line before the routes

app.use(express.json());

const userRoutes = require("./routes/user.route");
const noteRoutes = require("./routes/note.route");
app.use("/user", userRoutes);
app.use("/note", noteRoutes);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

const port = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb Connected");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

module.exports = app;

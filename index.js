import express from "express";
import { PORT } from "./config.js";
import { Users } from "./src/models/users.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World with Nodejs!");
});

app.post("/login", (req, res) => {
  const { name } = req.body;
  res.json({ user: name });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("Body: ", req.body);

  try {
    const id = Users.create(username, password);
    return res.send({ id });
  } catch (error) {
    res.status(400).send("Error!");
  }
});

app.post("/logout", (req, res) => {});

app.get("/protected", (req, res) => {});

//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

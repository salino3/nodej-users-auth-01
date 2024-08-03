import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config.js";
import { Users } from "./src/models/users.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs"); // only it without 'src' folder
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", {
    username: "Andrés",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.login(username, password);
    res.send({ user });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Body: ", req.body);

  try {
    const id = await Users.create(username, password);
    return res.send({ id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/logout", (req, res) => {});

app.get("/protected", (req, res) => {
  res.render("protected");
});

//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

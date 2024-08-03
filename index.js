import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { PORT, SECRET_KEY } from "./config.js";
import { Users } from "./src/models/users.js";
import { middlewareToken } from "./src/middleware/middleware-token.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs"); // only it without 'src' folder
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.json());
app.use(cookieParser());

app.use(middlewareToken);

app.get("/", (req, res) => {
  const { user } = req.session;
  res.render("index", user);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.login(username, password);
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    console.log("->: ", SECRET_KEY);
    res
      .cookie("access_token", token, {
        httpOnly: true, // cookie accessible only in backend
        secure: process.env.NODE_ENV === "production", // only https in production environment
        sameSite: "strict", // coockie valid only in same domain
        expires: new Date(Date.now() + 3600000), // 1h
      })
      .send({ user });
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

app.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.send("Logged out successfully");
  res.render("index");
});

app.get("/protected", (req, res) => {
  const { user } = req.session;

  if (!user) {
    return res.status(403).send("Access not authorized");
  }

  res.render("protected", user);
});

//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import DBLocal from "db-local";
const { Schema } = new DBLocal({ path: "./db" });
import crypto from "crypto";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../config.js";

const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class Users {
  static create(username, password) {
    if (typeof username !== "string") {
      throw new Error("username must be a string");
    }
    if (typeof username?.length < 4) {
      throw new Error("username must be at least 4 characters");
    }
    if (typeof password !== "string") {
      throw new Error("password must be a string");
    }
    if (typeof password?.length < 6) {
      throw new Error("username must be at least 6 characters");
    }

    const user = User.findOne({ username });
    if (user) {
      throw new Error("username already taken");
    }

    const id = crypto.randomUUID();
    const hashPassword = bcrypt.hashPassword(
      password,
      parseInt(SALT_ROUNDS, 10)
    );

    User.create({ _id: id, username, password }).save();

    return id;
  }
  static login(username, password) {}
}

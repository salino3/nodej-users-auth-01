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
  static async create(username, password) {
    Validation.username(username);
    Validation.password(password);

    const user = await User.findOne({ username });
    if (user) {
      throw new Error("username already taken");
    }

    const id = crypto.randomUUID();
    const hashPassword = await bcrypt.hashSync(
      password,
      parseInt(SALT_ROUNDS, 10)
    );

    User.create({ _id: id, username, password: hashPassword }).save();

    return id;
  }

  static async login(username, password) {
    Validation.username(username);
    Validation.password(password);

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    const isValid = await bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    return user;
  }
}

class Validation {
  static username(username) {
    if (typeof username !== "string") {
      throw new Error("username must be a string");
    }
    if (typeof username?.length < 4) {
      throw new Error("username must be at least 4 characters");
    }
  }

  static password(password) {
    if (typeof password !== "string") {
      throw new Error("password must be a string");
    }
    if (typeof password?.length < 6) {
      throw new Error("username must be at least 6 characters");
    }
  }
}

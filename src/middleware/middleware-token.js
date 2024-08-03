import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config.js";

export const middlewareToken = (req, res, next) => {
  const token = req.cookies.access_token;

  req.session = { user: null };

  if (token) {
    try {
      const data = jwt.verify(token, SECRET_KEY);
      req.session.user = data;
      console.log("protected: ", data);
    } catch (error) {
      console.error(error.message);
    }
  }

  next();
};

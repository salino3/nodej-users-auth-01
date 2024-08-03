import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const { PORT = 3200, SALT_ROUNDS = 10, SECRET_KEY } = process.env;

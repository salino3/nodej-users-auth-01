import dotenv from "dotenv";

dotenv.config();

export const { PORT = 3200 } = process.env;

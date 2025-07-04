import dotenv from "dotenv";
dotenv.config();

const ENV = process.env;

export const MONGO_URI = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;
export const PORT = process.env.PORT || "3000";
export const JWT_SECRET = process.env.JWT_SECRET || "Toi-muon-co-bo";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
export const HMS_ACCESS_KEY = process.env.HMS_ACCESS_KEY;
export const HMS_SECRET = process.env.HMS_SECRET;

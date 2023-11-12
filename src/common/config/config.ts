import path from 'path';
import dotenv from 'dotenv';
// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  DB_PASS: string | undefined;
  DO_DB_PASS: string | undefined;
  PORT: number | undefined;
  COOKIE_SECRET: string | undefined;
  JWT_SECRET: string | undefined;
  OTP_URL: string | undefined;
  API_KEY: string | undefined;
  CLIENT_ID: string | undefined;
  SENDER_ID: string | undefined;
}

interface Config {
  DB_PASS: string;
  DO_DB_PASS: string;
  PORT: number;
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  OTP_URL: string;
  API_KEY: string;
  CLIENT_ID: string;
  SENDER_ID: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    DB_PASS: process.env.DB_PASS,
    DO_DB_PASS: process.env.DO_DB_PASS,
    PORT: process.env.PORT ? Number(process.env.PORT) : 4001,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    OTP_URL: process.env.OTP_URL,
    API_KEY: process.env.API_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    SENDER_ID: process.env.SENDER_ID,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Parsing the env file.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
// Loading process.env as ENV interface
const getConfig = () => {
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
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
//# sourceMappingURL=config.js.map
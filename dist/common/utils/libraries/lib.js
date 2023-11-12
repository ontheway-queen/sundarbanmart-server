"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
class Lib {
    /**
     * make hashed password
     */
    static hashPass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    /**
     * verify password
     */
    static compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hashedPassword);
        });
    }
    /**
     * create token
     */
    static createToken(creds, maxAge) {
        return jsonwebtoken_1.default.sign(creds, config_1.default.JWT_SECRET, { expiresIn: maxAge });
    }
    // verify token
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
    /**
     * generate otp
     */
    static otpGen() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let otp = '';
        for (let i = 0; i < 6; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            otp += numbers[randomNumber];
        }
        return otp;
    }
    /**
     * send sms
     */
    static sendSms(phone, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpUrl = config_1.default.OTP_URL;
                const apiKey = config_1.default.API_KEY;
                const clientId = config_1.default.CLIENT_ID;
                const senderId = config_1.default.SENDER_ID;
                const numbers = '+880' + phone;
                const url = `${otpUrl}?ApiKey=${apiKey}&ClientId=${clientId}&SenderId=${senderId}&Message=${message}&MobileNumbers=${numbers}&Is_Unicode=true`;
                const result = yield axios_1.default.get(url);
                console.log(result.data);
                return true;
            }
            catch (err) {
                console.log({ err });
                return false;
            }
        });
    }
    /**
     * queryParser
     */
    static fieldParser(table, fields) {
        const parsedFields = [];
        for (let e = 0; e < fields.length; e++) {
            const element = fields[e];
            parsedFields.push(`${table}.${element}`);
        }
        return parsedFields;
    }
}
Lib.maxAge = 30 * 24 * 60 * 60;
exports.default = Lib;
//# sourceMappingURL=lib.js.map
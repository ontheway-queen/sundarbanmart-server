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
const queries_1 = __importDefault(require("../../../common/dataAccess/queries"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
const otwDb_1 = require("../../../otwDb");
class RequireOtp {
    constructor(otp_creds) {
        this.phone = otp_creds.phone;
        this.otp = otp_creds.otp;
        this.type = otp_creds.type;
    }
    /**
     * require otp
     */
    requireOtp() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = otwDb_1.dbCon.getPool();
            const conn = yield pool.promise().getConnection();
            const query = new queries_1.default(conn);
            const fields = ['id', 'hashed_otp', 'tried'];
            const otp_creds = {
                fields,
                table: 'otp',
                phone: this.phone,
                type: this.type,
            };
            const data = yield query.getOtp(otp_creds);
            if (data.length < 1) {
                throw new customError_1.default('OTP expired', 400, 'Invalid OTP');
            }
            else {
                const { id, hashed_otp, tried } = data[0];
                const isOtpValid = yield lib_1.default.compare(this.otp, hashed_otp);
                if (isOtpValid) {
                    const data = { tried: tried + 1, matched: 1 };
                    yield query.update({ table: 'otp', data, where: { id } });
                    const maxAge = 15 * 60;
                    if (this.type === 'forget' || this.type === 'register') {
                        const token = lib_1.default.createToken({ phone: this.phone, type: this.type }, maxAge);
                        return token;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    const data = { tried: tried + 1 };
                    yield query.update({ table: 'otp', data, where: { id } });
                    throw new customError_1.default('Please Provide a valid OTP', 400, 'Invalid OTP');
                }
            }
        });
    }
}
exports.default = RequireOtp;
//# sourceMappingURL=requireOtp.js.map
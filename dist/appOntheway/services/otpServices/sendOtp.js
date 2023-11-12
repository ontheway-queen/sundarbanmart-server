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
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
const queries_1 = __importDefault(require("../../../common/dataAccess/queries"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class SendOtp {
    constructor(obj) {
        this.sendOtp = () => __awaiter(this, void 0, void 0, function* () {
            const fields = ['id', 'hashed_otp', 'tried'];
            const data = yield this.query.getOtp({
                fields,
                table: 'otp',
                phone: this.phone,
                type: this.type,
            });
            if (data.length > 0) {
                throw new customError_1.default('Cannot send another OTP within 2 minutes', 400, 'Limited OTP');
            }
            else {
                const otp = lib_1.default.otpGen();
                const hashed_otp = yield lib_1.default.hashPass(otp);
                let message;
                if (this.type === 'forget') {
                    message = `${otp} - is the OTP to reset your password. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
                }
                else if (this.type === 'register') {
                    message = `${otp} - is the OTP to register your account. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
                }
                else if (this.type === 'order') {
                    message = `Your OTP is - ${otp}. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
                }
                else {
                    throw new customError_1.default('Please select a valid OTP type eg. (forget | register | order)', 400, 'Invalid OTP');
                }
                const otp_creds = {
                    hashed_otp,
                    phone: this.phone,
                    type: this.type,
                };
                const sent = yield lib_1.default.sendSms(Number(this.phone), message);
                yield this.query.insert('otp', otp_creds);
                if (sent) {
                    return { success: true, message: 'OTP sent successfully' };
                }
                else {
                    return { success: false, message: 'Cannot send OTP' };
                }
            }
        });
        this.phone = obj.phone;
        this.type = obj.type;
        this.query = new queries_1.default(obj.conn);
    }
}
exports.default = SendOtp;
//# sourceMappingURL=sendOtp.js.map
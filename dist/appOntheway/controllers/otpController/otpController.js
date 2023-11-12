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
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const genOtp_1 = __importDefault(require("../../services/otpServices/genOtp"));
const requireOtp_1 = __importDefault(require("../../services/otpServices/requireOtp"));
class OtpController extends abstractController_1.default {
    constructor() {
        super();
        /**
         * generate OTP
         */
        this.generateOtp = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type } = req.params;
            const { phone, user } = req.body;
            const obj = { phone, user, type };
            const data = yield new genOtp_1.default(obj).genOtp();
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json({ success: true, message: data.message });
            }
            else {
                this.error((data === null || data === void 0 ? void 0 : data.message) || 'Something went wrong', 400, 'Cannot send OTP');
            }
        }));
        /**
         * match OTP
         */
        this.matchOtp = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { otp_creds } = req.body;
            const token = yield new requireOtp_1.default(otp_creds).requireOtp();
            if (token) {
                res.status(200).json({ success: true, token });
            }
            else {
                this.error('Make sure you are using valid route to verify OTP', 400, 'Invlaid OTP route');
            }
        }));
    }
}
exports.default = OtpController;
//# sourceMappingURL=otpController.js.map
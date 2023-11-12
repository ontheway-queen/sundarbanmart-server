"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otpController_1 = __importDefault(require("../../controllers/otpController/otpController"));
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
class OptRouter extends abstractRouter_1.default {
    constructor() {
        super();
        this.otpCon = new otpController_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         * generate OTP
         */
        this.routers.post('/send/:type', this.otpCon.generateOtp);
        /**
         * match OTP
         */
        this.routers.post('/match', this.otpCon.matchOtp);
    }
}
exports.default = OptRouter;
//# sourceMappingURL=otpRouters.js.map
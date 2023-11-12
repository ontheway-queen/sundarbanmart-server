"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authControllers_1 = __importDefault(require("../../controllers/authController/authControllers"));
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
class AuthRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.authCon = new authControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         * register a user
         */
        this.routers.post('/queen/register', this.singleUploader.upload('queens'), this.reqSetter.setRequest, this.authCon.register);
        /**
         * login a user
         */
        this.routers.post('/:user/login', this.authCon.login);
        /**
         * forgetPassword
         */
        this.routers.post('/forget/:user', this.authCon.forgetPassword);
    }
}
exports.default = AuthRouters;
//# sourceMappingURL=authRouters.js.map
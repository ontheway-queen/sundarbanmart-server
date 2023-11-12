"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const commonController_1 = __importDefault(require("../../controllers/commonController/commonController"));
class CommonRouter extends abstractRouter_1.default {
    constructor() {
        super();
        this.commonController = new commonController_1.default();
        this.callRouter();
    }
    // call router
    callRouter() {
        this.routers.get('/register/check/phone/:type/:phone', this.commonController.checkPhoneForReg);
    }
}
exports.default = CommonRouter;
//# sourceMappingURL=commonRouters.js.map
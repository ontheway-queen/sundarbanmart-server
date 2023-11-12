"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const adminSearchController_1 = __importDefault(require("../../controllers/adminController/adminSearchController"));
class AdminSearchRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.adminSearchController = new adminSearchController_1.default();
        this.callRouters();
    }
    callRouters() {
        this.routers.get('/search/:part/:type', this.adminSearchController.adminSearch);
    }
}
exports.default = AdminSearchRouters;
//# sourceMappingURL=adminSearchRouters.js.map
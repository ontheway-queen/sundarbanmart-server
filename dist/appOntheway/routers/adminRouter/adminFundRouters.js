"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const adminFundController_1 = __importDefault(require("../../controllers/adminController/adminFundController"));
class AdminFundRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.adminFundControllers = new adminFundController_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         * getAllFunds
         */
        this.routers.get('/get/all', this.adminFundControllers.getAllFunds);
        /**
         * get a fund
         */
        this.routers.get('/get/one/:id', this.adminFundControllers.getAFund);
        /**
         * update queen fund info
         */
        this.routers.put('/update/info/:id', this.adminFundControllers.updateQueenFundInfo);
    }
}
exports.default = AdminFundRouters;
//# sourceMappingURL=adminFundRouters.js.map
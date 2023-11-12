"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const fundControllers_1 = __importDefault(require("../../controllers/genController/fundControllers"));
class FundRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.fundControllers = new fundControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         *  queen apply for fund
         */
        this.routers.post('/apply', this.fundControllers.queenApplyForFund);
        /**
         *  queen update guaranter
         */
        this.routers.post('/update/guaranter/:fund_id', this.singleUploader.upload('guaranters'), this.reqSetter.setRequest, this.fundControllers.queenUpdateGuaranter);
        /**
         *  queen update guaranter nids
         */
        this.routers.put('/update/g/nid/:id', this.multipleUploader.upload('nids'), this.reqSetter.setRequest, this.fundControllers.queenUpdateGuaranerNids);
        /**
         *  get a queens all applications
         */
        this.routers.get('/get/all/by/queen/:queen_id', this.fundControllers.getAQueensAllApplications);
    }
}
exports.default = FundRouters;
//# sourceMappingURL=fundRouters.js.map
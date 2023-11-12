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
const socket_1 = require("../../../common/socket/socket");
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const fundServices_1 = __importDefault(require("../../services/fundServices/fundServices"));
class FundControllers extends abstractController_1.default {
    constructor() {
        super();
        this.fundServices = new fundServices_1.default();
        /**
         * queenApplyForFund
         */
        this.queenApplyForFund = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fundServices.queenApplyForFund(req);
            if (data.success) {
                res.status(200).json(data);
                socket_1.io.emit('new_fund_application', data);
            }
            else {
                this.error();
            }
        }));
        /**
         * queenUpdateGuaranter
         */
        this.queenUpdateGuaranter = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fundServices.queenUpdateGuaranter(req);
            if (data.success) {
                res.status(200).json({
                    success: true,
                    message: data.message,
                    g_photo: data.data,
                    g_id: data.id,
                });
            }
            else {
                this.error();
            }
        }));
        /**
         * queenUpdateGuaranerNids
         */
        this.queenUpdateGuaranerNids = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonServices.updateNids('fund_guaranter', req);
            if (data.success) {
                res
                    .status(200)
                    .json({ success: true, message: data.message, data: data.data });
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * getAQueensAllApplications
         */
        this.getAQueensAllApplications = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fundServices.getAQueensAllApplications(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.data });
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = FundControllers;
//# sourceMappingURL=fundControllers.js.map
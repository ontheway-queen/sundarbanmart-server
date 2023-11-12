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
const adminQueenServices_1 = __importDefault(require("../../services/queenServices/adminQueenServices"));
const commonQueenServices_1 = __importDefault(require("../../services/queenServices/commonQueenServices"));
class AdminQueenControllers extends abstractController_1.default {
    constructor() {
        super();
        this.adminQueenServices = new adminQueenServices_1.default();
        this.commonQueenServices = new commonQueenServices_1.default();
        /**
         * getAQueenByPhone
         */
        this.getAQueen = (table) => this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonQueenServices.getAQueen(table, req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res
                    .status(400)
                    .json({ success: false, message: 'Cannot get all queens' });
            }
        }));
        /**
         * getAllQueens
         */
        this.getAllQueens = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getAllQueens(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all queens', 400, 'Bad Request');
            }
        }));
        // get all queen by status for admin
        this.getAllQueensByStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getAllQueensByStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all queens', 400, 'Bad Request');
            }
        }));
        /**
         * updateQueensInfo
         */
        this.updateQueensInfo = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.updateQueensInfo(req);
            if (data.success) {
                res
                    .status(200)
                    .json({ success: true, message: data.message, img: data.data });
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        // get queen by date range
        this.getQueenBydateRange = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getQueenByDateRange(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get queen by date range and status
        this.getQueenBydateRangeAndStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getQueenByDateRangeAndStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get queen by date
        this.getQueenBydate = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getQueenByDate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get queen by date and status
        this.getQueenBydateAndStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getQueenByDateAndStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get queen by category and status or all
        this.getQueenByCategoryAndStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminQueenServices.getQueenByQueenCategoryStatusAll(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = AdminQueenControllers;
//# sourceMappingURL=adminQueenControllers.js.map
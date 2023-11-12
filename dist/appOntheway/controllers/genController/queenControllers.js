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
const notificationServices_1 = __importDefault(require("../../services/adminPanelServices/notificationServices"));
const commonQueenServices_1 = __importDefault(require("../../services/queenServices/commonQueenServices"));
const queenService_1 = __importDefault(require("../../services/queenServices/queenService"));
class QueenControllers extends abstractController_1.default {
    constructor() {
        super();
        this.queenServices = new queenService_1.default();
        this.commonQueenServices = new commonQueenServices_1.default();
        this.notificationServices = new notificationServices_1.default();
        /**
         * getAQueen
         */
        this.getAQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonQueenServices.getAQueen('queens', req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.data });
            }
            else {
                this.error();
            }
        }));
        // get a queens all ref queen
        this.getAQueensAllRefQ = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonQueenServices.getAQueensAllRefQ(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // search queen by name
        this.searchQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenServices.searchQueen(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * queenUploadNids
         */
        this.queenUploadNids = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonServices.updateNids('admin_queens', req);
            if (data.success) {
                res
                    .status(200)
                    .json({ success: true, message: data.message, data: data.data });
            }
            else {
                this.error(data.message, data.status, 'Something went Wrong');
            }
        }));
        /**
         * updateQueensInfo
         */
        this.updateQueensInfo = this.assyncWrapper.wrap((req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.queenServices.updateQueensInfo(req);
            if (data.success) {
                res.status(200).json({ success: true, message: data.message });
                const notification = yield this.notificationServices.postNotification('queen-updated', { msg: 'Updated her information', update_id: Number(id) });
                socket_1.io.emit('new_notification', notification);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * updateQueenDp
         */
        this.updateQueenDp = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.commonServices.updateDp('admin_queens', req);
            if (data.success) {
                res.status(200).json({
                    success: true,
                    message: data.message,
                    filename: data.data,
                });
                const notification = yield this.notificationServices.postNotification('queen-updated', { msg: 'Updated her photo', update_id: Number(id) });
                socket_1.io.emit('new_notification', notification);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * getAllApprovedQueens
         */
        this.getAllApprovedQueens = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenServices.getAllApprovedQueens(req);
            if (data.success) {
                res.status(200).json(Object.assign({ success: true, data: data.data }, (data.total && { total: data.total })));
            }
            else {
                this.error();
            }
        }));
        /**
         * queenUpdatePassword
         */
        this.queenUpdatePassword = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenServices.queenUpdatePassword(req);
            if (data.success) {
                res.status(200).json({ success: true, message: data.message });
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = QueenControllers;
//# sourceMappingURL=queenControllers.js.map
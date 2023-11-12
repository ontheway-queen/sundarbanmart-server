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
const clientSideServices_1 = __importDefault(require("../../services/clientSideServices/clientSideServices"));
class clientController extends abstractController_1.default {
    constructor() {
        super();
        this.clientSideServices = new clientSideServices_1.default();
        //Contact msg post controller
        this.sendContactMsg = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.clientSideServices.sendContactMsg(req);
            if (data.success) {
                res.status(200).json(data);
                socket_1.io.emit('new_contact_msg', Object.assign(Object.assign({}, req.body), { id: data.id, msg_date: data.msg_date, status: data.status }));
            }
            else {
                this.error(data.message);
            }
        }));
        // get all contact msgs controller
        this.getAllContactMsg = this.assyncWrapper.wrap((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.clientSideServices.getAllContactMsg();
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get a single contact msg controller
        this.getSingleContactMsg = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.clientSideServices.getSingleContactMsg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // update singel contact msg controller
        this.updateSingleContactMsg = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.clientSideServices.updateSingleContactMsg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = clientController;
//# sourceMappingURL=clientController.js.map
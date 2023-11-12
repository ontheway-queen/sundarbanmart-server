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
const adminPanelServices_1 = __importDefault(require("../../services/adminPanelServices/adminPanelServices"));
class AdminPanelControllers extends abstractController_1.default {
    constructor() {
        super();
        this.adminPanelServices = new adminPanelServices_1.default();
        /**
         * login a user
         */
        this.login = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminPanelServices.login(req.body);
            if (data.success) {
                req.andro
                    ? res.set('__a_o', data.token)
                    : res.cookie('__a_o', data.token);
                res.status(200).json({ success: true, data: data.user });
            }
            else {
                res.status(400).json(data);
            }
        }));
    }
}
exports.default = AdminPanelControllers;
//# sourceMappingURL=adminPanelController.js.map
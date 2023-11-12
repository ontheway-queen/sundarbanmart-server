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
const commonServices_1 = __importDefault(require("../../services/commonServices"));
class CommonController extends abstractController_1.default {
    constructor() {
        super();
        this.commonService = new commonServices_1.default();
        // check phone for register
        this.checkPhoneForReg = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.params.phone.length < 12 && req.params.phone.length > 10) {
                const auths = [
                    'admin_queens',
                    'freelancing_seller',
                    'freelancing_buyer',
                    'social_users',
                    'customers',
                    'training_trainee',
                ];
                if (auths.includes(req.params.type)) {
                    const data = yield this.commonService.checkPhoneForReg(req.params.phone, req.params.type);
                    if (data.success) {
                        res.status(200).json(data);
                    }
                    else {
                        res.status(500).json(data);
                    }
                }
                else {
                    res
                        .status(404)
                        .json({ success: false, message: 'Invalid auth type' });
                }
            }
            else {
                res.status(443).json({ success: false, message: 'Invalid phone' });
            }
        }));
    }
}
exports.default = CommonController;
//# sourceMappingURL=commonController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
const assyper_1 = __importDefault(require("../common/middlewares/assypers/assyper"));
const commonServices_1 = __importDefault(require("../appOntheway/services/commonServices"));
class AbstractController {
    constructor() {
        this.assyncWrapper = new assyper_1.default();
        this.commonServices = new commonServices_1.default();
    }
    error(message, status, type) {
        throw new customError_1.default(message || 'Something went wrong', status || 500, type || 'Internal server Error');
    }
}
exports.default = AbstractController;
//# sourceMappingURL=abstractController.js.map
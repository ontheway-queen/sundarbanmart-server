"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = __importDefault(require("../common/dataAccess/queries"));
const deleteFIle_1 = __importDefault(require("../common/utils/fileRemover/deleteFIle"));
const transaction_1 = __importDefault(require("../common/utils/transaction/transaction"));
const dbAccess_1 = __importDefault(require("../common/dataAccess/dbAccess"));
const manageFile_1 = __importDefault(require("../common/utils/manageFile/manageFile"));
const otwDb_1 = require("../otwDb");
class AbstractServices {
    constructor() {
        this.dbAccess = new dbAccess_1.default(otwDb_1.dbCon);
        this.query = new queries_1.default(this.dbAccess);
        this.deleteFile = new deleteFIle_1.default();
        this.transaction = new transaction_1.default(this.dbAccess);
        this.manageFile = new manageFile_1.default();
    }
}
exports.default = AbstractServices;
//# sourceMappingURL=abstractServices.js.map
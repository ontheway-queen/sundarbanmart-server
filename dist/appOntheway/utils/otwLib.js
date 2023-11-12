"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const queries_1 = __importDefault(require("../../common/dataAccess/queries"));
const dbAccess_1 = __importDefault(require("../../common/dataAccess/dbAccess"));
const otwDb_1 = require("../../otwDb");
class otwLib {
    // CREATE CRON JOB
    static cronTask() {
        node_cron_1.default.schedule('0 0 0 * * *', () => {
            new queries_1.default(new dbAccess_1.default(otwDb_1.dbCon)).cronDeleteOTP();
        });
        node_cron_1.default.schedule('0 0 0 * * *', () => {
            new queries_1.default(new dbAccess_1.default(otwDb_1.dbCon)).cronDeleteNoti();
        });
    }
}
exports.default = otwLib;
//# sourceMappingURL=otwLib.js.map
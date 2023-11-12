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
const queries_1 = __importDefault(require("../../dataAccess/queries"));
const customError_1 = __importDefault(require("../errors/customError"));
class Transaction {
    constructor(db) {
        /**
         * beginTransaction
         */
        this.beginTransaction = (cb) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.pool.promise().getConnection();
            const query = new queries_1.default(conn);
            try {
                yield query.beginTransaction();
                const data = yield cb(query);
                yield query.commit();
                return data;
            }
            catch (err) {
                console.log({ sad: err.sql });
                query.rollback();
                throw new customError_1.default(err.message, err.status, err.type);
            }
        });
        this.pool = db.instance.getPool();
    }
}
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractServices_1 = __importDefault(require("../../../abstracts/abstractServices"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class AdminFundServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * getAllFunds
     */
    getAllFunds() {
        return __awaiter(this, void 0, void 0, function* () {
            const fund = yield this.query.select({
                table: 'fund',
                fields: {
                    columns: ['id', 'amount', 'status', 'apply_date'],
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [
                                ['name', 'queen_name'],
                                ['photo', 'queen_dp'],
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'fund', field: 'queen_id' },
                    },
                ],
            });
            return { success: true, data: fund };
        });
    }
    /**
     * getAFund
     */
    getAFund(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params || {};
            const fund = yield this.query.select({
                table: 'fund',
                fields: {
                    columns: [
                        'id',
                        'guardian_name',
                        'guardian_type',
                        'dob',
                        'nid_number',
                        'why',
                        'amount',
                        'return_time',
                        'return_type',
                        'status',
                    ],
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [
                                ['name', 'queen_name'],
                                ['photo', 'queen_dp'],
                                ['id', 'queen_id'],
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'fund', field: 'queen_id' },
                    },
                ],
                where: { table: 'fund', field: 'id', value: id },
            });
            const guaranter = yield this.query.select({
                table: 'fund_guaranter',
                fields: {
                    as: [['id', 'guaranter_id']],
                    columns: [
                        'name',
                        'dob',
                        'address',
                        'phone',
                        'nid_number',
                        'photo',
                        'nid_front',
                        'nid_back',
                        'relation',
                    ],
                },
                where: { table: 'fund_guaranter', field: 'fund_id', value: fund[0].id },
            });
            return {
                success: true,
                data: Object.assign(Object.assign({}, fund[0]), { fund_guaranter: guaranter[0] }),
            };
        });
    }
    /**
     * updateQueenFundStatus
     */
    updateQueenFundInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const _a = req.body, { queen_id } = _a, body = __rest(_a, ["queen_id"]);
            const data = yield this.query.update({
                table: 'fund',
                data: body,
                where: { id },
            });
            if (data.affectedRows) {
                return {
                    success: true,
                    message: 'Queen fund successfully updated',
                };
            }
            else {
                throw new customError_1.default('Please provide a valid fund id to update', 400, 'Bad request');
            }
        });
    }
}
exports.default = AdminFundServices;
//# sourceMappingURL=adminFundServices.js.map
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
class FundServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * queenApplyForFund
     */
    queenApplyForFund(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { guaranter } = _a, body = __rest(_a, ["guaranter"]);
            const check = yield this.query.select({
                table: 'fund',
                fields: { columns: ['id'] },
                where: { table: 'fund', field: 'queen_id', value: body.queen_id },
            });
            let data;
            if (check.length > 0) {
                yield this.query.update({
                    table: 'fund',
                    data: body,
                    where: { queen_id: body.queen_id },
                });
                data = check[0].id;
            }
            else {
                const fund = yield this.query.insert('fund', body);
                const newFund = yield this.query.select({
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
                    where: { table: 'fund', field: 'id', value: fund.insertId },
                });
                data = newFund[0];
            }
            return {
                success: true,
                message: 'Data successfully updated',
                data,
            };
        });
    }
    /**
     * queenUpdateGuaranter
     */
    queenUpdateGuaranter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fund_id } = req.params;
            const { filename } = req.file || {};
            const check = yield this.query.select({
                table: 'fund_guaranter',
                fields: { columns: ['id', 'photo'] },
                where: { table: 'fund_guaranter', field: 'fund_id', value: fund_id },
            });
            let data;
            if (check.length > 0) {
                yield this.query.update({
                    table: 'fund_guaranter',
                    data: Object.assign(Object.assign({}, req.body), (filename && { photo: filename })),
                    where: { fund_id },
                });
                data = check[0].id;
                /**
                 * delete previous image if @filename exists
                 */
                filename && this.deleteFile.delete('guaranters', check[0].photo);
            }
            else {
                if (!filename) {
                    throw new customError_1.default("Please provide guaranter's photo showing his/her face", 400, 'Bad request');
                }
                const temp = yield this.query.insert('fund_guaranter', Object.assign(Object.assign({}, req.body), { fund_id, photo: filename }));
                data = temp.insertId;
            }
            return {
                success: true,
                message: 'Successfully updated guaranter',
                data: filename,
                id: data,
            };
        });
    }
    /**
     * getAQueensAllApplications
     */
    getAQueensAllApplications(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queen_id } = req.params;
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
                },
                where: { table: 'fund', field: 'queen_id', value: queen_id },
            });
            const guaranter = yield this.query.select({
                table: 'fund_guaranter',
                fields: {
                    columns: [
                        'name',
                        'dob',
                        'address',
                        'phone',
                        'nid_number',
                        'photo',
                        'nid_front',
                        'nid_back',
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
}
exports.default = FundServices;
//# sourceMappingURL=fundServices.js.map
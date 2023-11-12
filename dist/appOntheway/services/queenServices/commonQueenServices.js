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
const abstractServices_1 = __importDefault(require("../../../abstracts/abstractServices"));
class CommonQueenServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * getAQueen
     */
    getAQueen(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { phone } = req.params;
            const finder = id
                ? table === 'admin_queens'
                    ? ['id', id]
                    : ['admin_queens_id', id]
                : ['phone', phone];
            const columns = [
                'account_number',
                'address',
                'bank_name',
                'name',
                'nid_back',
                'nid_front',
                'phone',
                'photo',
                'post_code',
                'city',
                'email',
                'designation',
                'division',
                'social_user',
                'trainee',
            ];
            if (table === 'admin_queens') {
                columns.push(...['id', 'status', 'note', 'seller', 'reference_id', 'queen_category']);
            }
            const data = yield this.query.select({
                fields: { columns, as: [['last_update', 'join_date']] },
                table,
                where: { table, field: finder[0], value: finder[1] },
            });
            if (data.length < 1) {
                return { success: false };
            }
            else {
                return { success: true, data: data[0] };
            }
        });
    }
    // get a queens all reference queens
    getAQueensAllRefQ(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.query.select({
                table: 'admin_queens',
                fields: {
                    columns: ['id', 'name', 'photo', 'status', 'note', 'phone'],
                    as: [['last_update', 'reg_at']],
                },
                where: {
                    table: 'admin_queens',
                    field: 'reference_id',
                    value: id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = CommonQueenServices;
//# sourceMappingURL=commonQueenServices.js.map
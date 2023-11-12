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
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
class QueenServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    // search queen by name
    searchQueen(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const sql = 'SELECT queens.admin_queens_id as id, queens.name, queens.photo, queens.city, queens.division, queens.designation FROM ngf_ecommerce.queens where match(queens.name) against(?)';
            const data = yield this.query.rawQuery(sql, [name]);
            return {
                success: true,
                data,
            };
        });
    }
    /**
     * updateQueensInfo
     */
    updateQueensInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, address, email, city, post_code, division } = req.body;
            const data = yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const info = {
                    name,
                    address,
                    city,
                };
                if (email)
                    info.email = email;
                if (post_code)
                    info.post_code = post_code;
                if (division)
                    info.division = division;
                yield query.update({
                    table: 'admin_queens',
                    data: info,
                    where: { id },
                });
                const data = yield query.select({
                    table: 'queens',
                    fields: { columns: ['name'] },
                    where: { table: 'queens', field: 'admin_queens_id', value: id },
                });
                if (data.length > 0) {
                    const upVals = [
                        'name',
                        'phone',
                        'photo',
                        'address',
                        'post_code',
                        'city',
                        'division',
                        'lat',
                        'lng',
                        'nid_front',
                        'nid_back',
                    ];
                    if (email)
                        upVals.push('email');
                    yield query.replace({
                        replace: [...upVals, 'admin_queens_id'],
                        into: 'queens',
                        select: [...upVals, 'id'],
                        from: 'admin_queens',
                        where: { id },
                    });
                }
                return { success: true, message: 'Queen successfully updated' };
            }));
            return data;
        });
    }
    /**
     * getAllApprovedQueens
     */
    getAllApprovedQueens(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const sql = 'SELECT distinct queens.admin_queens_id as id,(select count(admin_products_id) as total_product from ngf_ecommerce.products where products.queen_id = queens.admin_queens_id)  as total_product, queens.name, queens.photo FROM ngf_ecommerce.queens join ngf_ecommerce.products where ngf_ecommerce.queens.admin_queens_id = ngf_ecommerce.products.queen_id order by (select count(admin_products_id) as total_product from ngf_ecommerce.products where products.queen_id = queens.admin_queens_id) desc limit ? offset ?';
            const values = [Number(limit), Number(skip)];
            const data = yield this.query.rawQuery(sql, values);
            const forCount = 'SELECT count(distinct(ngf_ecommerce.queens.admin_queens_id)) as total FROM ngf_ecommerce.queens join ngf_ecommerce.products where ngf_ecommerce.queens.admin_queens_id = ngf_ecommerce.products.queen_id';
            const count = yield this.query.rawQuery(forCount);
            return {
                success: true,
                data,
                total: count[0].total,
            };
        });
    }
    /**
     * queenUpdatePassword
     */
    queenUpdatePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { old_password, new_password } = req.body;
            const oldPass = yield this.query.select({
                fields: { columns: ['password'] },
                table: 'admin_queens',
                where: { table: 'admin_queens', field: 'id', value: id },
            });
            const isPassValid = yield lib_1.default.compare(old_password, oldPass[0].password);
            if (isPassValid) {
                const hashedPassword = yield lib_1.default.hashPass(new_password);
                yield this.query.update({
                    data: { password: hashedPassword },
                    table: 'admin_queens',
                    where: { id },
                });
                return {
                    success: true,
                    message: 'Your password changed successfully',
                };
            }
            else {
                throw new customError_1.default('Your old password is incorrect', 400, 'Bad request');
            }
        });
    }
}
exports.default = QueenServices;
//# sourceMappingURL=queenService.js.map
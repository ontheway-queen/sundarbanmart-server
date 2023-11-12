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
class AdminQueensServices extends abstractServices_1.default {
    constructor() {
        super();
        // get queen by date range
        this.getQueenByDateRange = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from, to } = req.query;
            const sql = `SELECT id, name,status,queen_category, phone, photo,last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE last_update BETWEEN ? AND ?`;
            const values = [from, to];
            const data = yield this.query.rawQuery(sql, values);
            return { success: true, data };
        });
        // get queen by date range and Status
        this.getQueenByDateRangeAndStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.params;
            const { from, to } = req.query;
            const sql = `SELECT id, name,status,queen_category, phone, photo,last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE status = ? AND last_update BETWEEN ? AND ?`;
            const values = [status, from, to];
            const data = yield this.query.rawQuery(sql, values);
            return { success: true, data };
        });
        // get queen by date
        this.getQueenByDate = (req) => __awaiter(this, void 0, void 0, function* () {
            const { date } = req.query;
            const sql = `SELECT id, name,status,queen_category, phone, photo, last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE date(last_update) = ?`;
            const values = [date];
            const data = yield this.query.rawQuery(sql, values);
            return { success: true, data };
        });
        // get queen by date and status
        this.getQueenByDateAndStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.params;
            const { date } = req.query;
            const sql = `SELECT id, name,status, phone, queen_category, photo, last_update AS reg_at, note FROM ngf_ecommerce.admin_queens WHERE status = ? AND date(last_update) = ?`;
            const values = [status, date];
            const data = yield this.query.rawQuery(sql, values);
            return { success: true, data };
        });
        // get all queen by queen category and status and all
        this.getQueenByQueenCategoryStatusAll = (req) => __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { status, category } = req.params;
            console.log({ status, category, limit, skip });
            const fields = [
                'id',
                'name',
                'phone',
                'photo',
                'status',
                'note',
                'queen_category',
            ];
            let where = null;
            if (category !== 'all' &&
                status !== 'all' &&
                category !== 'All' &&
                status !== 'All') {
                where = {
                    and: [
                        { table: 'admin_queens', field: 'status', value: `'${status}'` },
                        {
                            table: 'admin_queens',
                            field: 'queen_category',
                            value: `'${category}'`,
                        },
                    ],
                };
            }
            else {
                if (category !== 'all' && category !== 'All') {
                    where = {
                        table: 'admin_queens',
                        field: 'queen_category',
                        value: `'${category}'`,
                    };
                }
                if (status !== 'all' && status !== 'All') {
                    where = {
                        table: 'admin_queens',
                        field: 'status',
                        value: `'${status}'`,
                    };
                }
            }
            let forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens`;
            let countArr = [];
            let data = [];
            if (where) {
                data = yield this.query.select({
                    fields: { columns: fields, as: [['last_update', 'reg_at']] },
                    table: 'admin_queens',
                    where,
                    limit: { limit: limit, skip: Number(skip) || 0 },
                    orderBy: { table: 'admin_queens', field: 'last_update' },
                    desc: true,
                });
                if ((where === null || where === void 0 ? void 0 : where.field) === 'queen_category') {
                    forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.queen_category = ? `;
                    countArr.push(category);
                }
                else if ((where === null || where === void 0 ? void 0 : where.field) === 'status') {
                    forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.status = ? `;
                    countArr.push(status);
                }
                else {
                    forCuntSql = `SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where admin_queens.queen_category = ? and admin_queens.status = ?`;
                    countArr.push(category);
                    countArr.push(status);
                }
            }
            else {
                data = yield this.query.select({
                    fields: { columns: fields, as: [['last_update', 'reg_at']] },
                    table: 'admin_queens',
                    limit: { limit: limit, skip: Number(skip) || 0 },
                    orderBy: { table: 'admin_queens', field: 'last_update' },
                    desc: true,
                });
            }
            const count = yield this.query.rawQuery(forCuntSql, countArr);
            return {
                success: true,
                data: data,
                total: count[0].total,
            };
        });
    }
    // getAllQueens
    getAllQueens(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const fields = [
                'id',
                'name',
                'phone',
                'queen_category',
                'photo',
                'status',
                'note',
            ];
            const data = yield this.query.select({
                fields: { columns: fields, as: [['last_update', 'reg_at']] },
                table: 'admin_queens',
                limit: { limit: limit, skip: Number(skip) || 0 },
                orderBy: { table: 'admin_queens', field: 'last_update' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens';
            const count = yield this.query.rawQuery(forCount);
            // }
            return {
                success: true,
                total: count[0].total,
                data: data,
            };
        });
    }
    // get all queen by status for admin
    getAllQueensByStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { status } = req.params;
            const fields = [
                'id',
                'name',
                'phone',
                'photo',
                'status',
                'note',
                'queen_category',
            ];
            const data = yield this.query.select({
                fields: { columns: fields, as: [['last_update', 'reg_at']] },
                table: 'admin_queens',
                where: { table: 'admin_queens', field: 'status', value: `'${status}'` },
                limit: { limit: limit, skip: Number(skip) || 0 },
                orderBy: { table: 'admin_queens', field: 'last_update' },
                desc: true,
            });
            // let count: any = [];
            const forCount = 'SELECT count(ngf_ecommerce.admin_queens.id) as total FROM ngf_ecommerce.admin_queens where ngf_ecommerce.admin_queens.status=?';
            // if (skip === '0') {
            const count = yield this.query.rawQuery(forCount, [status]);
            // }
            return {
                success: true,
                data: data,
                total: count[0].total,
            };
            // if (count.length) {
            //   return { success: true, data: { total: count[0].total, data: data } };
            // } else {
            //   return { success: true, data: { data: data } };
            // }
        });
    }
    // updateQueensInfo
    updateQueensInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { filename } = req.file || {};
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                if (filename)
                    req.body.photo = filename;
                const prev = yield query.select({
                    fields: { columns: ['photo', 'seller'] },
                    table: 'admin_queens',
                    where: { table: 'admin_queens', field: 'id', value: id },
                });
                yield query.update({
                    table: 'admin_queens',
                    data: req.body,
                    where: { id },
                });
                if (req.body.status === 'rejected') {
                    yield query.delete({
                        table: 'products',
                        where: { queen_id: id },
                    });
                }
                const fields = [
                    'id',
                    'name',
                    'phone',
                    'photo',
                    'address',
                    'nid_front',
                    'nid_back',
                    'city',
                    'post_code',
                    'designation',
                    'queen_category',
                ];
                if (req.body.status === 'Approved') {
                    const reval = [...fields, 'lat', 'lng', 'email'];
                    reval.shift();
                    const res = yield query.replace({
                        into: 'queens',
                        replace: [...reval, 'admin_queens_id'],
                        select: [...reval, 'id'],
                        from: 'admin_queens',
                        where: { id },
                    });
                }
                else {
                    yield query.delete({
                        table: 'queens',
                        where: { admin_queens_id: id },
                    });
                }
                if (filename && prev.length > 0) {
                    this.deleteFile.delete('queens', prev[0].photo);
                }
                return {
                    success: true,
                    message: 'Queen info successfully updated',
                    data: filename,
                };
            }));
        });
    }
}
exports.default = AdminQueensServices;
//# sourceMappingURL=adminQueenServices.js.map
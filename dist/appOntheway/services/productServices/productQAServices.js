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
class productQAService extends abstractServices_1.default {
    constructor() {
        super();
    }
    // ask a question service
    askQuestionService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query.insert('product_qa', req.body);
            if (result.affectedRows) {
                return { success: true, data: { id: result.insertId } };
            }
            else {
                return { success: false };
            }
        });
    }
    // get all questions services for client
    getAllQuestionServiceClient(req, by) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { limit, skip } = req.query;
            const table = 'product_qa';
            const data = yield this.query.select({
                table,
                fields: {
                    columns: ['id', 'question', 'answer'],
                    otherFields: [
                        by === 'customer'
                            ? {
                                table: 'admin_products',
                                as: [
                                    ['id', 'product'],
                                    ['product_name', 'product_name'],
                                    ['q_date', 'question_date'],
                                ],
                            }
                            : {
                                table: 'customers',
                                as: [['name', 'customer_name']],
                            },
                    ],
                },
                limit: { limit: limit, skip: Number(skip) || 0 },
                join: [
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table, field: 'product' },
                    },
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table, field: 'customer' },
                    },
                ],
                where: {
                    and: [
                        { table, field: 'status', value: "'live'" },
                        { table, field: by, value: id },
                    ],
                },
                orderBy: { table, field: 'q_date' },
                desc: true,
            });
            const sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa. ?? = ?`;
            const total = yield this.query.rawQuery(sql, [by, id]);
            return { success: true, total: total[0].total, data };
        });
    }
    // get all questions services for admin panel
    getAllQuestionServiceAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type } = req.params;
            const { limit, skip } = req.query;
            const table = 'product_qa';
            const columns = ['id', 'question', 'q_date'];
            if (type === 'deleted') {
                columns.push('deleted_by');
                columns.push('answer');
            }
            if (type === 'answered') {
                columns.push('a_date');
                columns.push('answer');
            }
            const data = yield this.query.select({
                table,
                fields: {
                    columns,
                    otherFields: [
                        {
                            table: 'admin_products',
                            as: [
                                ['id', 'product'],
                                ['product_name', 'product_name'],
                                ['product_picture_1', 'product_photo'],
                            ],
                        },
                        {
                            table: 'customers',
                            as: [
                                ['id', 'customer'],
                                ['name', 'customer_name'],
                            ],
                        },
                    ],
                },
                limit: { limit: limit, skip: Number(skip) || 0 },
                join: [
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table, field: 'product' },
                    },
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table, field: 'customer' },
                    },
                ],
                where: {
                    and: type === 'deleted'
                        ? [
                            {
                                table,
                                field: 'status',
                                value: "'disabled'",
                            },
                        ]
                        : [
                            {
                                table,
                                field: 'answer',
                                value: type === 'answered' ? 'not null' : 'null',
                                compare: 'is',
                            },
                            {
                                table,
                                field: 'status',
                                value: "'live'",
                            },
                        ],
                },
                orderBy: { table, field: 'q_date' },
                desc: true,
            });
            let sql = '';
            if (type === 'deleted') {
                sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'disabled'`;
            }
            else if (type === 'answered') {
                sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa.answer is not null`;
            }
            else {
                sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.status = 'live' and product_qa.answer is null`;
            }
            const total = yield this.query.rawQuery(sql);
            return { success: true, total: total[0].total, data };
        });
    }
    // get all questions of a single product for admin
    getAllQuestionOfProductForAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { skip, limit } = req.query;
            const table = 'product_qa';
            const columns = ['id', 'question', 'answer', 'deleted_by', 'status'];
            const data = yield this.query.select({
                table,
                fields: {
                    columns,
                    otherFields: [
                        {
                            table: 'admin_products',
                            as: [
                                ['id', 'product'],
                                ['product_name', 'product_name'],
                                ['q_date', 'question_date'],
                                ['a_date', 'answer_date'],
                            ],
                        },
                        {
                            table: 'customers',
                            as: [
                                ['id', 'customer'],
                                ['name', 'customer_name'],
                            ],
                        },
                    ],
                },
                limit: { limit: limit, skip: Number(skip) || 0 },
                join: [
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table, field: 'product' },
                    },
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table, field: 'customer' },
                    },
                ],
                where: { table, field: 'product', value: id },
                orderBy: { table, field: 'q_date' },
                desc: true,
            });
            let sql = `select count(product_qa.id) as total from ngf_ecommerce.product_qa where product_qa.product = ?`;
            const total = yield this.query.rawQuery(sql, [id]);
            return { success: true, total: total[0].total, data };
        });
    }
    // update a question by admin or customer
    updateQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, by } = req.params;
            let data = req.body;
            if (by) {
                data = { status: 'disabled', deleted_by: by };
            }
            const result = yield this.query.update({
                table: 'product_qa',
                data,
                where: { id },
            });
            return {
                success: true,
                msg: by
                    ? 'Question deleted successfully'
                    : 'Question Answered successflly!',
            };
        });
    }
}
exports.default = productQAService;
//# sourceMappingURL=productQAServices.js.map
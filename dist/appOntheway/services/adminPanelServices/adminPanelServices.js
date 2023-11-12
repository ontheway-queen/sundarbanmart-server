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
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
// AUTHENTICATION CLASS
class AdminPanelServices extends abstractServices_1.default {
    constructor() {
        super();
        // admin panel search services
        this.AdminSearchService = (req) => __awaiter(this, void 0, void 0, function* () {
            const { part, type } = req.params;
            const { search } = req.query;
            let column = [];
            let table = '';
            let searchField = '';
            switch (part) {
                case 'queens':
                    column = ['id', 'name', 'status', 'phone', 'photo', 'note'];
                    table = 'admin_queens';
                    searchField = 'name';
                    break;
                case 'products':
                    column = [
                        'id',
                        'product_name',
                        'price',
                        'product_picture_1',
                        'status',
                        'category',
                        'queen_id',
                    ];
                    table = 'admin_products';
                    searchField = 'product_name';
                    break;
                case 'orders':
                    column = ['id', 'status', 'note'];
                    table = 'orders';
                    break;
                default:
                    return { success: false, data: 'Wrong search part' };
            }
            let data;
            if (type === 'id' || type === 'phone') {
                let query = {
                    table,
                    fields: { columns: column, as: [['last_update', 'reg_at']] },
                    where: { table, field: type, value: search },
                };
                if (part === 'orders') {
                    query = {
                        table,
                        fields: {
                            columns: column,
                            as: [['order_date', 'order_date']],
                            otherFields: [
                                { table: 'customers', as: [['name', 'customer_name']] },
                            ],
                        },
                        join: [
                            {
                                join: { table: 'customers', field: 'id' },
                                on: { table: 'orders', field: 'customer_id' },
                            },
                        ],
                        where: { table, field: type, value: search },
                    };
                }
                if (part === 'products') {
                    query = {
                        fields: {
                            columns: column,
                            otherFields: [
                                { table: 'admin_queens', as: [['name', 'queen_name']] },
                            ],
                        },
                        table,
                        where: { table, field: type, value: search },
                        join: [
                            {
                                join: { table: 'admin_queens', field: 'id' },
                                on: { table, field: 'queen_id' },
                            },
                        ],
                        orderBy: { table, field: 'upload_date' },
                        desc: true,
                    };
                }
                data = yield this.query.select(query);
            }
            else if (type === 'date') {
                data = yield this.query.select({
                    table,
                    fields: {
                        columns: column,
                        as: [['order_date', 'order_date']],
                        otherFields: [
                            { table: 'customers', as: [['name', 'customer_name']] },
                        ],
                    },
                    join: [
                        {
                            join: { table: 'customers', field: 'id' },
                            on: { table: 'orders', field: 'customer_id' },
                        },
                    ],
                    where: {
                        table,
                        field: 'order_date',
                        value: `'${search}'`,
                        date: true,
                    },
                });
            }
            else if (type === 'name') {
                let sql;
                if (part === 'queens') {
                    sql = `SELECT last_update AS reg_at, ?? FROM ?? WHERE MATCH (??) AGAINST (?)`;
                }
                else {
                    column = [
                        'admin_products.id',
                        'admin_products.product_name',
                        'admin_products.price',
                        'admin_products.product_picture_1',
                        'admin_products.status',
                        'admin_products.category',
                        'admin_products.queen_id',
                    ];
                    sql = `SELECT admin_queens.name as queen_name, ?? FROM ?? join ngf_ecommerce.admin_queens on admin_products.queen_id = admin_queens.id WHERE MATCH (??) AGAINST (?)`;
                }
                const values = [column, table, searchField, search];
                data = yield this.query.rawQuery(sql, values);
            }
            else {
                return { success: false, data: 'Wrong search type' };
            }
            console.log(data);
            return { success: true, data };
        });
    }
    /**
     * Login service
     */
    login(creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = creds;
            const fields = ['name', 'phone', 'password', 'email', 'photo', 'role'];
            const user = yield this.query.select({
                table: 'admin',
                fields: { columns: fields },
                where: { table: 'admin', field: 'phone', value: phone },
            });
            if (user.length < 1) {
                return { success: false, message: 'Username or password is incorrect!!' };
            }
            const { name, phone: userPhone, password: userPass, role } = user[0];
            const isPassValid = password === userPass;
            if (isPassValid) {
                const tokenCreds = { name, phone: userPhone, role };
                const token = lib_1.default.createToken(tokenCreds, lib_1.default.maxAge);
                const _a = user[0], { password } = _a, userTosend = __rest(_a, ["password"]);
                return { success: true, user: userTosend, token };
            }
            else {
                return { success: false, message: 'Username or password is incorrect!!' };
            }
        });
    }
}
exports.default = AdminPanelServices;
//# sourceMappingURL=adminPanelServices.js.map
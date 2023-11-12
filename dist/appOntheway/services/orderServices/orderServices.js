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
const requireOtp_1 = __importDefault(require("../../services/otpServices/requireOtp"));
const insertOrder_1 = __importDefault(require("./insertOrder"));
class OrderServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * createOrder
     */
    createOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_id, delivery_address, order_details, guest, guest_info, otp_creds, } = req.body;
            console.log(req.body);
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const order = {
                    delivery_address,
                    queen_id: order_details[0].queen_id,
                };
                if (guest === 1) {
                    const valid = yield new requireOtp_1.default(otp_creds).requireOtp();
                    console.log({ valid });
                    if (valid) {
                        const guest = yield query.select({
                            table: 'customers',
                            fields: { columns: ['id', 'guest'] },
                            where: {
                                table: 'customers',
                                field: 'phone',
                                value: guest_info.phone,
                            },
                        });
                        if (guest.length < 1) {
                            const guestCustomer = yield query.insert('customers', Object.assign(Object.assign({}, guest_info), { guest: 1 }));
                            order.customer_id = guestCustomer.insertId;
                        }
                        else {
                            const isGuest = guest[0].guest;
                            const id = guest[0].id;
                            yield query.update({
                                table: 'customers',
                                data: Object.assign(Object.assign({}, guest_info), { guest: isGuest }),
                                where: { id },
                            });
                            order.customer_id = id;
                        }
                    }
                }
                else {
                    order.customer_id = customer_id;
                }
                const data = yield new insertOrder_1.default().insert(query, order, order_details);
                if (data.success) {
                    const newOrder = yield query.select({
                        table: 'orders',
                        fields: {
                            columns: ['delivery_address', 'status', 'id', 'order_date'],
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
                        where: { table: 'orders', field: 'id', value: data.orderId },
                    });
                    return {
                        success: true,
                        message: 'Order successfull',
                        data: newOrder[0],
                    };
                }
                else {
                    return { success: false };
                }
            }));
        });
    }
    /**
     * getAQueensAllOrders
     */
    getAQueensAllOrders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queen_id } = req.params;
            const data = yield this.query.select({
                table: 'order_details',
                fields: {
                    columns: ['order_id', 'product_name', 'product_id', 'quantity'],
                    otherFields: [
                        { table: 'customers', as: [['name', 'customer_name']] },
                        {
                            table: 'orders',
                            columns: [
                                'customer_id',
                                'delivery_address',
                                'order_date',
                                'status',
                            ],
                        },
                        {
                            table: 'admin_products',
                            columns: [
                                'product_picture_1',
                                'product_picture_2',
                                'price',
                                'short_desc',
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'orders', field: 'id' },
                        on: { table: 'order_details', field: 'order_id' },
                    },
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'orders', field: 'customer_id' },
                    },
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table: 'order_details', field: 'product_id' },
                    },
                ],
                where: { table: 'order_details', field: 'queen_id', value: queen_id },
            });
            return { success: true, data };
        });
    }
    //  get a queen all order by status
    getAQueensAllOrderByStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queen_id, status } = req.params;
            const data = yield this.query.select({
                table: 'order_details',
                fields: {
                    columns: ['order_id', 'product_name', 'product_id', 'quantity'],
                    otherFields: [
                        { table: 'customers', as: [['name', 'customer_name']] },
                        {
                            table: 'orders',
                            columns: [
                                'customer_id',
                                'delivery_address',
                                'order_date',
                                'status',
                            ],
                        },
                        {
                            table: 'admin_products',
                            columns: [
                                'product_picture_1',
                                'product_picture_2',
                                'price',
                                'short_desc',
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'orders', field: 'id' },
                        on: { table: 'order_details', field: 'order_id' },
                    },
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'orders', field: 'customer_id' },
                    },
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table: 'order_details', field: 'product_id' },
                    },
                ],
                where: {
                    and: [
                        { table: 'order_details', field: 'queen_id', value: queen_id },
                        { table: 'orders', field: 'status', value: `'${status}'` },
                    ],
                },
            });
            return { success: true, data };
        });
    }
    /**
     * getACustomersAllOrders
     */
    getACustomersAllOrders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_id, status } = req.params;
            const query = {
                table: 'order_details',
                fields: {
                    columns: [
                        'order_id',
                        'delivery_date',
                        'product_name',
                        'product_category',
                        'price',
                        'quantity',
                        'delivered',
                        'canceled',
                        'product_id',
                    ],
                    otherFields: [
                        {
                            table: 'admin_products',
                            as: [['product_picture_1', 'product_picture']],
                        },
                        {
                            table: 'orders',
                            columns: ['order_date', 'delivery_address', 'canceled', 'status'],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'orders', field: 'id' },
                        on: { table: 'order_details', field: 'order_id' },
                    },
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table: 'order_details', field: 'product_id' },
                    },
                ],
            };
            if (status === 'all') {
                query.where = {
                    table: 'orders',
                    field: 'customer_id',
                    value: customer_id,
                };
            }
            else {
                query.where = {
                    and: [
                        {
                            table: 'orders',
                            field: 'customer_id',
                            value: customer_id,
                        },
                        {
                            table: 'orders',
                            field: 'status',
                            value: `'${status}'`,
                        },
                    ],
                };
            }
            const data = yield this.query.select(query);
            return { success: true, data };
        });
    }
    /**
     * getAllOrders
     */
    getAllOrders(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const data = yield this.query.select({
                table: 'orders',
                fields: {
                    columns: ['id', 'delivery_address', 'status', 'order_date'],
                    otherFields: [{ table: 'customers', as: [['name', 'customer_name']] }],
                },
                join: [
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'orders', field: 'customer_id' },
                    },
                ],
                limit: { limit: limit, skip: Number(skip) || 0 },
                orderBy: { table: 'orders', field: 'order_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.orders.id) as total FROM ngf_ecommerce.orders';
            const count = yield this.query.rawQuery(forCount);
            return { success: true, total: count[0].total, data: data };
        });
    }
    /**
     * getAllOrders by status
     */
    getAllOrdersByStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { status } = req.params;
            const data = yield this.query.select({
                table: 'orders',
                fields: {
                    columns: ['id', 'delivery_address', 'status', 'order_date'],
                    otherFields: [{ table: 'customers', as: [['name', 'customer_name']] }],
                },
                where: { table: 'orders', field: 'status', value: `'${status}'` },
                join: [
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'orders', field: 'customer_id' },
                    },
                ],
                limit: { limit: limit, skip: Number(skip) || 0 },
                orderBy: { table: 'orders', field: 'order_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.orders.id) as total FROM ngf_ecommerce.orders where ngf_ecommerce.orders.status=?';
            const count = yield this.query.rawQuery(forCount, [status]);
            return { success: true, total: count[0].total, data: data };
        });
    }
    /**
     * getAllOrders by status or date
     */
    getAllOrdersByStatusOrDate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from, to } = req.query;
            const { status } = req.params;
            console.log(status);
            let values = [from, to];
            let totalValues = [];
            // initial get order by status all
            let sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id  order by order_date desc limit ${limit} offset ${skip}`;
            let totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders`;
            if (status === 'all' && from && to) {
                values = [from, to];
                totalValues.push(from, to);
                sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.order_date between ? and ? order by order_date desc limit ${limit} offset ${skip}`;
                totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.order_date between ? and ?`;
            }
            if (status !== 'all' && from && to) {
                values = [status, ...values];
                totalValues.push(status, from, to);
                sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.status= ? and orders.order_date between ? and ? order by order_date desc limit ${limit} offset ${skip}`;
                totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.status=? and orders.order_date between ? and ? `;
            }
            if (status !== 'all' && !from) {
                values = [status, ...values];
                totalValues.push(status);
                sql = `SELECT orders.id,orders.order_date,orders.status,orders.note,customers.name as customer_name FROM ngf_ecommerce.orders join ngf_ecommerce.customers on orders.customer_id = customers.id where orders.status= ? order by order_date desc limit ${limit} offset ${skip}`;
                totalSql = `SELECT count(orders.id) as total FROM ngf_ecommerce.orders where orders.status=?`;
            }
            const data = yield this.query.rawQuery(sql, values);
            const total = (yield this.query.rawQuery(totalSql, totalValues));
            return { success: true, data: data, total: total[0].total };
        });
    }
    /**
     * getAOrder
     */
    getAOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const order = yield query.select({
                    table: 'orders',
                    fields: {
                        columns: [
                            'delivery_address',
                            'status',
                            'queen_id',
                            'note',
                            'order_date',
                        ],
                        as: [['id', 'order_id']],
                        otherFields: [
                            {
                                table: 'customers',
                                as: [
                                    ['name', 'customer_name'],
                                    ['phone', 'customer_phone'],
                                ],
                            },
                        ],
                    },
                    join: [
                        {
                            join: { table: 'customers', field: 'id' },
                            on: { table: 'orders', field: 'customer_id' },
                        },
                    ],
                    where: { table: 'orders', field: 'id', value: id },
                });
                const order_details = yield query.select({
                    table: 'order_details',
                    fields: {
                        columns: [
                            'order_id',
                            'product_name',
                            'product_category',
                            'product_id',
                            'price',
                            'quantity',
                            'delivery_date',
                        ],
                        as: [['id', 'order_id']],
                        otherFields: [
                            {
                                table: 'admin_queens',
                                as: [
                                    ['name', 'queen_name'],
                                    ['photo', 'queen_photo'],
                                ],
                            },
                        ],
                    },
                    join: [
                        {
                            join: { table: 'admin_queens', field: 'id' },
                            on: { table: 'order_details', field: 'queen_id' },
                        },
                    ],
                    where: { table: 'order_details', field: 'order_id', value: id },
                });
                return { success: true, data: Object.assign(Object.assign({}, order[0]), { order_details }) };
            }));
        });
    }
    // get an orders all products
    getAnOrdersAllProducts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const products = yield this.query.select({
                table: 'order_details',
                fields: {
                    columns: [
                        'queen_id',
                        'product_name',
                        'product_category',
                        'product_id',
                        'price',
                        'quantity',
                        'delivery_date',
                    ],
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [['name', 'queen_name']],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'order_details', field: 'queen_id' },
                    },
                ],
                where: { table: 'order_details', field: 'order_id', value: Number(id) },
            });
            if (products.length) {
                return {
                    success: true,
                    data: products,
                };
            }
            else {
                return {
                    success: false,
                    message: 'No products found with this id',
                };
            }
        });
    }
    // get an order status for tracking
    getOrderStatusTrack(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { phone } = req.query;
            const status = yield this.query.select({
                table: 'orders',
                fields: {
                    columns: ['status'],
                    as: [['id', 'order_id']],
                },
                join: [
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'orders', field: 'customer_id' },
                    },
                ],
                where: {
                    and: [
                        { table: 'orders', field: 'id', value: id },
                        { table: 'customers', field: 'phone', value: phone },
                    ],
                },
            });
            if (status.length) {
                return { success: true, data: status[0] };
            }
            else {
                return { success: false };
            }
        });
    }
    /**
     * updateOrderStatus
     */
    updateOrderStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status, note } = req.body;
            yield this.query.update({
                table: 'orders',
                data: { status, note },
                where: { id },
            });
            return { success: true, message: 'Order status successfully updated' };
        });
    }
}
exports.default = OrderServices;
//# sourceMappingURL=orderServices.js.map
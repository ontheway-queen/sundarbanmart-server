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
class CommonProductServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * getAQueensAllProducts
     */
    getAQueensAllProducts(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queen_id: id } = req.params;
            const commons = [
                'product_name',
                'product_picture_1',
                'product_picture_2',
                'price',
                'category',
                'tags',
                'weight',
                'delivery_day',
                'stock_status',
            ];
            let fields;
            let where;
            if (table === 'admin_products') {
                fields = { columns: [...commons, 'id', 'status', 'short_desc'] };
            }
            else {
                fields = {
                    columns: commons,
                    as: [['admin_products_id', 'id']],
                };
            }
            if (req.andro) {
                where = {
                    and: [
                        { table, field: 'queen_id', value: id, compare: '=' },
                        { table, field: 'status', value: "'Disabled'", compare: '!=' },
                    ],
                };
            }
            else {
                where = { table, field: 'queen_id', value: id };
            }
            const products = yield this.query.select({
                fields: Object.assign(Object.assign({}, fields), { otherFields: [{ table: 'admin_queens', as: [['photo', 'queen_dp']] }] }),
                table,
                where,
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table, field: 'queen_id' },
                    },
                ],
                orderBy: { table, field: 'upload_date' },
                desc: true,
            });
            return { success: true, data: products };
        });
    }
    /**
     * getAProducts
     */
    getAProduct(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (table === 'products') {
                const sql = `SELECT admin_products.id as product_id, upload_date, admin_products.product_name, admin_products.category, admin_products.short_desc,admin_products.weight, admin_products.product_picture_1,admin_products.product_picture_2, admin_products.price, admin_products.delivery_day, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating, count(rating.id) as rating_count FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status='approved' and  admin_products.id = ?`;
                const data = (yield this.query.rawQuery(sql, [id]));
                if (data[0].product_id) {
                    return { success: true, data: data[0] };
                }
                else {
                    return {
                        success: false,
                        message: 'No product found with this id',
                    };
                }
            }
            else {
                const columns = [
                    'product_name',
                    'category',
                    'product_picture_1',
                    'product_picture_2',
                    'price',
                    'delivery_day',
                    'short_desc',
                    'tags',
                    'stock_status',
                    'weight',
                    'queen_id',
                    'id',
                    'status',
                    'upload_date',
                ];
                const data = yield this.query.select({
                    table,
                    fields: Object.assign(Object.assign({ columns }, (table === 'products' && {
                        as: [['admin_products_id', 'product_id']],
                    })), { otherFields: [
                            {
                                table: 'admin_queens',
                                as: [['name', 'queen_name']],
                            },
                        ] }),
                    where: { table, field: 'id', value: id },
                    join: [
                        {
                            join: { table: 'admin_queens', field: 'id' },
                            on: { table, field: 'queen_id' },
                        },
                    ],
                });
                if (data.length) {
                    return { success: true, data: data[0] };
                }
                else {
                    return {
                        success: false,
                        message: 'No product found with this id',
                    };
                }
            }
        });
    }
    /**
     * getAllProducts
     */
    getAllProducts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const columns = [
                'id',
                'product_name',
                'product_picture_1',
                'status',
                'price',
                'stock_status',
                'category',
            ];
            const products = yield this.query.select({
                table: 'admin_products',
                fields: {
                    columns,
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [
                                ['id', 'queen_id'],
                                ['name', 'queen_name'],
                            ],
                        },
                    ],
                },
                limit: { limit: limit, skip: Number(skip) || 0 },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'admin_products', field: 'queen_id' },
                    },
                ],
                orderBy: { table: 'admin_products', field: 'upload_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.admin_products.id) as total FROM ngf_ecommerce.admin_products';
            const count = yield this.query.rawQuery(forCount);
            return {
                success: true,
                data: products,
                total: count[0].total,
            };
        });
    }
    // get all products by status
    getAllProductsByStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { status } = req.params;
            const columns = [
                'id',
                'product_name',
                'product_picture_1',
                'status',
                'price',
                'stock_status',
                'category',
            ];
            const products = yield this.query.select({
                table: 'admin_products',
                fields: {
                    columns,
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [
                                ['id', 'queen_id'],
                                ['name', 'queen_name'],
                            ],
                        },
                    ],
                },
                where: { table: 'admin_products', field: 'status', value: `'${status}'` },
                limit: { limit: limit, skip: Number(skip) || 0 },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'admin_products', field: 'queen_id' },
                    },
                ],
                orderBy: { table: 'admin_products', field: 'upload_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.admin_products.id) as total FROM ngf_ecommerce.admin_products where ngf_ecommerce.admin_products.status= ?';
            const count = yield this.query.rawQuery(forCount, [status]);
            return {
                success: true,
                data: products,
                total: count[0].total,
            };
        });
    }
    /**
     * deleteProduct
     */
    deleteProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                yield query.update({
                    table: 'admin_products',
                    data: { status: 'Disabled' },
                    where: { id },
                });
                yield query.delete({
                    table: 'products',
                    where: { admin_products_id: id },
                });
                return { success: true, message: 'Product successfully deleted' };
            }));
        });
    }
    /**
     * getAllProductsByCategory
     */
    getAllProductsByCategory(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = req.params;
            const { limit, skip } = req.query;
            let products;
            let columns = [
                'product_name',
                'product_picture_1',
                'price',
                'stock_status',
            ];
            if (table === 'admin_products') {
                columns = [
                    'id',
                    'product_name',
                    'product_picture_1',
                    'status',
                    'price',
                    'stock_status',
                    'category',
                ];
                let getQuery = {
                    table: 'admin_products',
                    fields: {
                        columns,
                        otherFields: [
                            {
                                table: 'admin_queens',
                                as: [
                                    ['id', 'queen_id'],
                                    ['name', 'queen_name'],
                                ],
                            },
                        ],
                    },
                    where: {
                        table: table,
                        field: 'category',
                        value: `'${category}'`,
                    },
                    limit: { limit: limit, skip: Number(skip) || 0 },
                    join: [
                        {
                            join: { table: 'admin_queens', field: 'id' },
                            on: { table: 'admin_products', field: 'queen_id' },
                        },
                    ],
                    orderBy: { table: 'admin_products', field: 'upload_date' },
                    desc: true,
                };
                if (category === 'recent-product') {
                    getQuery = {
                        table: 'admin_products',
                        fields: {
                            columns,
                            otherFields: [
                                {
                                    table: 'admin_queens',
                                    as: [
                                        ['id', 'queen_id'],
                                        ['name', 'queen_name'],
                                    ],
                                },
                            ],
                        },
                        limit: { limit: limit, skip: Number(skip) || 0 },
                        join: [
                            {
                                join: { table: 'admin_queens', field: 'id' },
                                on: { table: 'admin_products', field: 'queen_id' },
                            },
                        ],
                        orderBy: { table: 'admin_products', field: 'upload_date' },
                        desc: true,
                    };
                }
                products = yield this.query.select(getQuery);
            }
            else {
                let sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.category= ? and admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;
                if (category === 'recent-product') {
                    sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;
                    products = yield this.query.rawQuery(sql, [
                        Number(limit),
                        Number(skip),
                    ]);
                }
                else {
                    products = yield this.query.rawQuery(sql, [
                        category,
                        Number(limit),
                        Number(skip),
                    ]);
                }
            }
            let forCount = "SELECT count(distinct(admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ? and admin_products.status = 'approved'";
            if (category === 'recent-product') {
                forCount =
                    "SELECT count(distinct(admin_products.id)) as total FROM ngf_ecommerce.admin_products where and admin_products.status = 'approved'";
            }
            if (table === 'admin_products') {
                forCount =
                    'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ?';
                if (category === 'recent-product') {
                    forCount =
                        'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products';
                }
            }
            else {
                if (category === 'recent-product') {
                    forCount =
                        "SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.status = 'approved'";
                }
            }
            let count;
            if (category === 'recent-product') {
                count = yield this.query.rawQuery(forCount);
            }
            else {
                count = yield this.query.rawQuery(forCount, [category]);
            }
            return {
                success: true,
                data: products,
                total: count[0].total,
            };
        });
    }
    /**
     * getAllProductsByCategory and status
     */
    getAllProductsByCategoryAndStatus(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, status } = req.params;
            const { limit, skip } = req.query;
            let products;
            let columns = [
                'product_name',
                'product_picture_1',
                'price',
                'stock_status',
            ];
            if (table === 'admin_products') {
                columns = [
                    'id',
                    'product_name',
                    'product_picture_1',
                    'status',
                    'price',
                    'stock_status',
                    'category',
                ];
                products = yield this.query.select({
                    table: 'admin_products',
                    fields: {
                        columns,
                        otherFields: [
                            {
                                table: 'admin_queens',
                                as: [
                                    ['id', 'queen_id'],
                                    ['name', 'queen_name'],
                                ],
                            },
                        ],
                    },
                    where: {
                        and: [
                            { table, field: 'category', value: `'${category}'` },
                            { table, field: 'status', value: `'${status}'` },
                        ],
                    },
                    limit: { limit: limit, skip: Number(skip) || 0 },
                    join: [
                        {
                            join: { table: 'admin_queens', field: 'id' },
                            on: { table: 'admin_products', field: 'queen_id' },
                        },
                    ],
                    orderBy: { table: 'admin_products', field: 'upload_date' },
                    desc: true,
                });
            }
            else {
                const sql = `SELECT admin_products.id, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.category= ? and admin_products.status = 'approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;
                products = yield this.query.rawQuery(sql, [
                    category,
                    Number(limit),
                    Number(skip),
                ]);
            }
            if (table === 'admin_products') {
                const forCount = 'SELECT count(distinct(ngf_ecommerce.admin_products.id)) as total FROM ngf_ecommerce.admin_products where admin_products.category = ? and admin_products.status = ?';
                const count = yield this.query.rawQuery(forCount, [category, status]);
                return {
                    success: true,
                    total: count[0].total,
                    data: products,
                };
            }
            return { success: true, data: products };
        });
    }
}
exports.default = CommonProductServices;
//# sourceMappingURL=commonProductServices.js.map
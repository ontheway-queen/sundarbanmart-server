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
class ProductServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * queenUploadProduct
     */
    queenUploadProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqFiles = req.files;
            const product_picture_1 = reqFiles[0] && reqFiles[0].filename;
            const product_picture_2 = reqFiles[1] && reqFiles[1].filename;
            const productValues = Object.assign(Object.assign({}, req.body), { product_picture_1,
                product_picture_2, tags: `${req.body.category} ${req.body.tags}` });
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const data = yield query.insert('admin_products', productValues);
                const columns = [
                    'id',
                    'queen_id',
                    'product_name',
                    'category',
                    'product_picture_1',
                    'product_picture_2',
                    'price',
                    'delivery_day',
                    'short_desc',
                    'status',
                    'tags',
                    'weight',
                    'stock_status',
                ];
                const response = yield query.select({
                    table: 'admin_products',
                    fields: {
                        columns,
                        otherFields: [
                            {
                                table: 'admin_queens',
                                as: [
                                    ['photo', 'queen_photo'],
                                    ['name', 'queen_name'],
                                ],
                            },
                        ],
                    },
                    join: [
                        {
                            join: { table: 'admin_queens', field: 'id' },
                            on: { table: 'admin_products', field: 'queen_id' },
                        },
                    ],
                    where: { table: 'admin_products', field: 'id', value: data.insertId },
                });
                return { success: true, data: response[0] };
            }));
        });
    }
    /**
     * queenUpdateProduct request
     */
    queenRequestUpdateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                console.log(req.body, id, req.files);
                const reqFiles = req.files;
                const product_picture_1 = reqFiles[0] && reqFiles[0];
                const product_picture_2 = reqFiles[1] && reqFiles[1];
                if (product_picture_1) {
                    if (product_picture_1.fieldname === 'product_picture_1') {
                        req.body.product_picture_1 = product_picture_1.filename;
                    }
                    else {
                        req.body.product_picture_2 = product_picture_1.filename;
                    }
                }
                if (product_picture_2) {
                    req.body.product_picture_2 = product_picture_2.filename;
                }
                const data = yield query.select({
                    table: 'update_products',
                    fields: {
                        columns: ['product_id', 'product_picture_1', 'product_picture_2'],
                    },
                    where: { table: 'update_products', field: 'product_id', value: id },
                });
                if (data.length) {
                    console.log(req.body);
                    const result = yield query.update({
                        table: 'update_products',
                        data: req.body,
                        where: { product_id: id },
                    });
                    if (result.affectedRows) {
                        if (req.body.product_picture_1 && data[0].product_picture_1) {
                            this.deleteFile.delete('products', data[0].product_picture_1);
                        }
                        if (req.body.product_picture_2 && data[0].product_picture_2) {
                            this.deleteFile.delete('products', data[0].product_picture_2);
                        }
                    }
                }
                else {
                    req.body.product_id = id;
                    const result = yield query.insert('update_products', req.body);
                }
                return {
                    success: true,
                    data: Object.assign(Object.assign({}, req.body), { product_id: id }),
                    message: 'Product update request send successfully!',
                };
            }));
        });
    }
    /**
     * getAllApprovedProducts
     */
    getAllApprovedProducts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const sql = `SELECT admin_products.id, admin_products.delivery_day, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_queens.name as queen_name,admin_queens.id as queen_id, round (avg(rating.rating),1) as rating FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id=admin_products.queen_id left join ngf_ecommerce.rating on admin_products.id = rating.product where admin_products.status='approved' group by admin_products.id order by admin_products.upload_date desc limit ? offset ? `;
            const totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.status = 'Approved'`;
            const data = yield this.query.rawQuery(sql, [Number(limit), Number(skip)]);
            const total = (yield this.query.rawQuery(totalSql, []));
            return { success: true, data, total: total[0].total };
        });
    }
    /**
     * searchProducts
     */
    searchProducts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, limit, skip } = req.query;
            const data = yield this.query.search(search, limit, skip);
            return Object.assign({ success: true }, data);
        });
    }
}
exports.default = ProductServices;
//# sourceMappingURL=productServices.js.map
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
class AdminProductServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * updateProduct
     */
    updateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqFiles = req.files || [];
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const product_picture_1 = reqFiles[0] && reqFiles[0].filename;
                const product_picture_2 = reqFiles[1] && reqFiles[1].filename;
                const firstProduct = reqFiles[0] && reqFiles[0].fieldname;
                const secondProduct = reqFiles[1] && reqFiles[1].fieldname;
                const updatedImgs = {};
                if (firstProduct === 'product_picture_1') {
                    updatedImgs.product_picture_1 = product_picture_1;
                }
                else if (firstProduct === 'product_picture_2') {
                    updatedImgs.product_picture_2 = product_picture_1;
                }
                if (secondProduct === 'product_picture_2') {
                    updatedImgs.product_picture_2 = product_picture_2;
                }
                const fieldsName = [];
                for (let i = 0; i < reqFiles.length; i++) {
                    fieldsName.push(reqFiles[i].fieldname);
                }
                const { product_name, category, price, delivery_day, short_desc, queen_id, stock_status, status, tags, weight, } = req.body;
                const productInfo = {
                    product_name,
                    category,
                    price,
                    delivery_day,
                    stock_status,
                    short_desc,
                    queen_id,
                    status,
                    tags,
                    weight,
                };
                if (fieldsName.includes('product_picture_1')) {
                    productInfo.product_picture_1 = product_picture_1;
                    this.deleteFile.delete('products', req.body.prev_1);
                }
                if (fieldsName.includes('product_picture_2')) {
                    productInfo.product_picture_2 = product_picture_2 || product_picture_1;
                    this.deleteFile.delete('products', req.body.prev_2);
                }
                yield query.update({
                    table: 'admin_products',
                    data: productInfo,
                    where: { id },
                });
                const repVals = [
                    'queen_id',
                    'product_name',
                    'category',
                    'product_picture_1',
                    'product_picture_2',
                    'delivery_day',
                    'short_desc',
                    'price',
                    'tags',
                    'upload_date',
                    'stock_status',
                    'weight',
                ];
                if (req.body.status === 'Approved') {
                    yield query.replace({
                        replace: [...repVals, 'admin_products_id'],
                        into: 'products',
                        select: [...repVals, 'id'],
                        from: 'admin_products',
                        where: { id },
                    });
                }
                else {
                    yield query.delete({
                        table: 'products',
                        where: { admin_products_id: id },
                    });
                }
                if (updatedImgs.product_picture_1 || updatedImgs.product_picture_2) {
                    return {
                        success: true,
                        message: 'Product Successfully updated',
                        updatedImgs,
                    };
                }
                else {
                    return {
                        success: true,
                        message: 'Product Successfully updated',
                    };
                }
            }));
        });
    }
    // get all product by date range and or status and or category
    getAllProductByDateRangeStatusCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from, to } = req.query;
            const { status, category } = req.params;
            let values = [from, to];
            let totalValues = [from, to];
            let sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.upload_date between ? and ? order by upload_date desc `;
            let totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ?`;
            if (status !== 'all') {
                values = [status, ...values];
                totalValues.push(status);
                sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.status = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;
                totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.status = ? `;
            }
            if (category !== 'all') {
                values = [category, ...values];
                totalValues.push(category);
                sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.category = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;
                totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.category = ? `;
            }
            if (category !== 'all' && status !== 'all') {
                sql = `SELECT admin_products.id, admin_products.status, admin_products.product_name, admin_products.product_picture_1, admin_products.price, admin_products.stock_status, admin_products.category, admin_queens.id as queen_id, admin_queens.name as queen_name FROM ngf_ecommerce.admin_products join ngf_ecommerce.admin_queens on admin_queens.id = admin_products.queen_id where admin_products.category = ? and admin_products.status = ? and admin_products.upload_date between ? and ? order by upload_date desc  `;
                totalSql = `SELECT count(admin_products.id) as total FROM ngf_ecommerce.admin_products where admin_products.upload_date between ? and ? and admin_products.status = ? and admin_products.category = ? `;
            }
            const data = yield this.query.rawQuery(sql, values);
            const total = (yield this.query.rawQuery(totalSql, totalValues));
            return {
                success: true,
                data,
                total: total[0].total,
            };
        });
    }
    // approve update product
    approveUpdateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const [data] = yield query.select({
                    table: 'update_products',
                    fields: {
                        columns: [
                            'product_name',
                            'category',
                            'product_picture_1',
                            'product_picture_2',
                            'price',
                            'delivery_day',
                            'short_desc',
                            'tags',
                            'delivery_charge',
                            'stock_status',
                            'weight',
                        ],
                    },
                    where: { table: 'update_products', field: 'product_id', value: id },
                });
                if (data === null || data === void 0 ? void 0 : data.product_name) {
                    Object.keys(data).forEach((item) => {
                        if (data[item] === null) {
                            delete data[item];
                        }
                    });
                    const product = yield query.select({
                        table: 'admin_products',
                        fields: {
                            columns: ['status', 'product_picture_2', 'product_picture_1'],
                        },
                        where: { table: 'admin_products', field: 'id', value: id },
                    });
                    const { status, product_picture_1: prev_1, product_picture_2: prev_2, } = product[0] || {};
                    yield query.update({
                        table: 'admin_products',
                        data,
                        where: { id },
                    });
                    if (status === 'Approved') {
                        yield query.update({
                            table: 'products',
                            data,
                            where: { admin_products_id: id },
                        });
                    }
                    if (data.product_picture_1) {
                        this.deleteFile.delete('products', prev_1);
                    }
                    if (data.product_picture_2) {
                        this.deleteFile.delete('products', prev_2);
                    }
                    yield query.delete({
                        table: 'update_products',
                        where: { product_id: id },
                    });
                    return {
                        success: true,
                        message: 'Product update approved successfully!',
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'No update pending product with this id',
                    };
                }
            }));
        });
    }
    // reject update product
    rejectUpdateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { product_picture_1, product_picture_2 } = req.body;
            yield this.query.delete({
                table: 'update_products',
                where: { product_id: id },
            });
            if (product_picture_1) {
                this.deleteFile.delete('products', product_picture_1);
            }
            if (product_picture_2) {
                this.deleteFile.delete('products', product_picture_2);
            }
            return { success: true, message: 'Update Product rejected successfully' };
        });
    }
    // get all pending update product
    getAllPendingUpdateProduct(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query.rawQuery('SELECT * FROM ngf_ecommerce.update_products'));
            return { success: true, data, total: data.length };
        });
    }
    // get a queen all pending update product
    getAllPendingUpdateProductOfQueen(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.query.rawQuery('SELECT * FROM ngf_ecommerce.update_products WHERE update_products.queen_id= ?', [id]);
            return { success: true, data };
        });
    }
    // get a single product update
    getASingleProductUpdate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = (yield this.query.rawQuery('SELECT * FROM ngf_ecommerce.update_products WHERE update_products.product_id= ?', [id]));
            if (data.length) {
                return { success: true, data: data[0] };
            }
            else {
                return { success: true, message: 'No pending request of this product' };
            }
        });
    }
}
exports.default = AdminProductServices;
//# sourceMappingURL=adminProductsServices.js.map
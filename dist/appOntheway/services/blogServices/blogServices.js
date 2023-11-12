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
class BlogServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    // post blog
    postBlog(req, type) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.type = type;
            if (type === 'Admin') {
                req.body.status = 'Approved';
            }
            const { filename } = req.file;
            if (filename) {
                req.body.thumbnail = filename;
            }
            else {
                return {
                    success: false,
                    message: 'Cannot post a blog without thumbnail photo',
                };
            }
            const result = yield this.query.insert('ontheway_blogs', req.body);
            if (result.insertId) {
                return {
                    success: true,
                    data: { id: result.insertId, thumbnail: filename },
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot post blog now try again',
                };
            }
        });
    }
    // get all blogs by type and status and all
    getAllBlogsByTypeStatusAll(type, status, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            type = type.toLocaleLowerCase();
            status = status.toLocaleLowerCase();
            let totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs`;
            let totalDepArray = [];
            let where = undefined;
            const table = 'ontheway_blogs';
            const columns = [
                'id',
                'title',
                'thumbnail',
                'author_name',
                'author_id',
                'post_date',
                'status',
            ];
            if (type !== 'all' && status !== 'all') {
                where = {
                    and: [
                        { table, field: 'type', value: `'${type}'` },
                        { table, field: 'status', value: `'${status}'` },
                    ],
                };
                totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.type = ? and ontheway_blogs.status = ?`;
                totalDepArray.push(type);
                totalDepArray.push(status);
            }
            else if (status !== 'all') {
                where = { table, field: 'status', value: `'${status}'` };
                totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.status = ?`;
                totalDepArray.push(status);
            }
            else if (type !== 'all') {
                where = { table, field: 'type', value: `'${type}'` };
                totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.type = ?`;
                totalDepArray.push(type);
            }
            else {
                columns.push('type');
            }
            const data = yield this.query.select({
                table,
                fields: {
                    columns,
                },
                where: where,
                orderBy: { table, field: 'post_date' },
                desc: true,
                limit: { limit, skip },
            });
            const [total] = (yield this.query.rawQuery(totalSql, totalDepArray));
            return {
                success: true,
                total: total.total,
                data,
            };
        });
    }
    // get a single blog
    getASingleBlog(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'ontheway_blogs';
            const columns = [
                'id',
                'title',
                'description',
                'thumbnail',
                'author_name',
                'author_id',
                'post_date',
                'status',
                'type',
            ];
            let where = { table, field: 'id', value: id };
            if (status === 'Approved') {
                where = {
                    and: [
                        { table, field: 'id', value: id },
                        { table, field: 'status', value: `'${status}'` },
                    ],
                };
            }
            const data = yield this.query.select({ table, fields: { columns }, where });
            if (data.length) {
                return {
                    success: true,
                    data: data[0],
                };
            }
            else {
                return {
                    success: false,
                    message: 'No blog found with this id',
                };
            }
        });
    }
    //update a Blog
    updateABlog(req, author) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'ontheway_blogs';
            const { id } = req.params;
            let body = req.body;
            const { filename } = req.file;
            const checkBlog = yield this.query.select({
                table,
                fields: { columns: ['author_id', 'thumbnail'] },
                where: { table, field: 'id', value: id },
            });
            if (!checkBlog.length) {
                return {
                    success: false,
                    message: 'No blog found with this id',
                };
            }
            if (author) {
                if (checkBlog[0].author_id !== author) {
                    return {
                        success: false,
                        message: 'You have not access to update this blog',
                    };
                }
                const _a = req.body, { author_id, status } = _a, rest = __rest(_a, ["author_id", "status"]);
                body = rest;
            }
            if (filename) {
                body.thumbnail = filename;
                if (checkBlog[0].thumbnail) {
                    this.deleteFile.delete('blog_thumbnails', checkBlog[0].thumbnail);
                }
            }
            const res = yield this.query.update({ table, data: body, where: { id } });
            if (res.affectedRows) {
                return {
                    success: true,
                    data: { thumbnail: filename },
                    message: 'Blog updated successfully',
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot update blog now',
                };
            }
        });
    }
    // delete a Blog
    deleteABlog(id, author) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'ontheway_blogs';
            const checkBlog = yield this.query.select({
                table,
                fields: { columns: ['author_id', 'thumbnail'] },
                where: { table, field: 'id', value: id },
            });
            if (!checkBlog.length) {
                return {
                    success: false,
                    message: 'No blog found with this id',
                };
            }
            if (author) {
                if (author !== checkBlog[0].author_id) {
                    return {
                        success: false,
                        message: 'You dont have access to delete this blog',
                    };
                }
            }
            const res = yield this.query.delete({ table, where: { id } });
            if (res.affectedRows) {
                if (checkBlog[0].thumbnail) {
                    yield this.deleteFile.delete('blog_thumbnails', checkBlog[0].thumbnail);
                }
                return {
                    success: true,
                    message: 'Blog deleted successfully!',
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot delete blog now',
                };
            }
        });
    }
}
exports.default = BlogServices;
//# sourceMappingURL=blogServices.js.map
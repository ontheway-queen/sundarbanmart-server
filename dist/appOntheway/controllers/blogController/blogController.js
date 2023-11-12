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
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const blogServices_1 = __importDefault(require("../../services/blogServices/blogServices"));
const socket_1 = require("../../../common/socket/socket");
class BlogController extends abstractController_1.default {
    constructor() {
        super();
        this.blogService = new blogServices_1.default();
        // post a blog for admin
        this.postBlogAdmin = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            req.body.author_name = 'Ontheway';
            const data = yield this.blogService.postBlog(req, 'Admin');
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message);
            }
        }));
        // post a blog for queen
        this.postBlogQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.author_name && req.body.author_id) {
                const data = yield this.blogService.postBlog(req, 'Queen');
                if (data.success) {
                    res.status(200).json(data);
                }
                else {
                    this.error(data.message);
                }
            }
            else {
                this.error('Author name and id is required');
            }
        }));
        // get all blog by type and status and all
        this.getAllBlogByTypeStatusAll = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, status } = req.params;
            const { skip, limit } = req.query;
            const data = yield this.blogService.getAllBlogsByTypeStatusAll(type, status, skip, limit);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get a single blog for admin or queen
        this.getASingelBlogForAdminQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.blogService.getASingleBlog(Number(id), 'all');
            if (data.success) {
                socket_1.io.emit('for-andorid', `Shamol bro your socket is connected`);
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            }
        }));
        // get a single blog for public
        this.getASingleBlogForPublic = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.blogService.getASingleBlog(Number(id), 'Approved');
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            }
        }));
        // update a blog for admin panel
        this.updateABlogForAdmin = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const data = yield this.blogService.updateABlog(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message);
            }
        }));
        // post a blog for queen
        this.updateABlogForQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.author_id) {
                const data = yield this.blogService.updateABlog(req, req.body.author_id);
                if (data.success) {
                    res.status(200).json(data);
                }
                else {
                    this.error(data.message);
                }
            }
            else {
                this.error('You cant update blog without author id');
            }
        }));
        // delete a Blog for admin
        this.deleteABlogForAdmin = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.blogService.deleteABlog(parseInt(id));
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
        // delete a Blog for queen
        this.deleteABlogForQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () { }));
    }
}
exports.default = BlogController;
//# sourceMappingURL=blogController.js.map
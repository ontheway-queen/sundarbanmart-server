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
class ContentImageServices extends abstractServices_1.default {
    constructor() {
        super();
        // Get content images
        this.getContentImgs = (req) => __awaiter(this, void 0, void 0, function* () {
            const { section } = req.params;
            +``;
            const data = yield this.query.select({
                table: 'content_images',
                fields: { columns: ['id', 'img', 'link'] },
                where: {
                    table: 'content_images',
                    field: 'section',
                    value: `'${section}'`,
                },
            });
            if (section === 'slider' || section === 'app_slider') {
                return { success: true, data };
            }
            else if (data.length === 1) {
                return { success: true, data: data[0] };
            }
            else {
                return { success: false, message: 'No image found' };
            }
        });
        // post or update slider images service
        this.sliderimageUploadOrUpdate = (req) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files || [];
            const { deleted } = req.body;
            const { section } = req.params;
            const sliders = [];
            const imgsToUpload = [];
            const imgsToUpdate = [];
            const imgsToDelete = [];
            return this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const prevImgs = yield this.query.select({
                    table: 'content_images',
                    fields: { columns: ['id', 'img'] },
                    where: {
                        table: 'content_images',
                        field: 'section',
                        value: `'${section}'`,
                    },
                });
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.fieldname.startsWith('new')) {
                        imgsToUpload.push([section, file.filename]);
                    }
                    else {
                        for (let j = 0; j < prevImgs.length; j++) {
                            const img = prevImgs[j];
                            if (Number(file.fieldname) === img.id) {
                                imgsToUpdate.push([Number(file.fieldname), file.filename]);
                            }
                        }
                    }
                }
                if (deleted) {
                    const dFiles = JSON.parse(deleted);
                    for (let i = 0; i < dFiles.length; i++) {
                        const file = dFiles[i];
                        for (let j = 0; j < prevImgs.length; j++) {
                            const img = prevImgs[j];
                            if (file === img.id) {
                                imgsToDelete.push(img.img);
                                yield query.delete({
                                    table: 'content_images',
                                    where: { id: img.id },
                                });
                                break;
                            }
                        }
                    }
                }
                if (imgsToUpdate.length) {
                    for (let i = 0; i < imgsToUpdate.length; i++) {
                        const img = imgsToUpdate[i];
                        const updater = yield query.update({
                            table: 'content_images',
                            data: { img: img[1] },
                            where: { id: img[0] },
                        });
                        if (updater.affectedRows) {
                            sliders.push({ id: img[0], img: img[1] });
                            for (let i = 0; i < prevImgs.length; i++) {
                                if (prevImgs[i].id === img[0]) {
                                    imgsToDelete.push(prevImgs[i].img);
                                }
                            }
                        }
                    }
                }
                if (imgsToUpload.length) {
                    const uploaded = yield query.multipleInsert('content_images', ['section', 'img'], imgsToUpload);
                    for (let i = 0; i < imgsToUpload.length; i++) {
                        sliders.push({ id: uploaded.insertId + i, img: imgsToUpload[i][1] });
                    }
                }
                this.deleteFile.delete('content_images', imgsToDelete);
                return { success: true, data: sliders };
            }));
        });
        // update daily deals img
        this.updateDailyDealsImgs = (req) => __awaiter(this, void 0, void 0, function* () {
            const { section } = req.params;
            const { filename } = req.file || {};
            const { link } = req.body;
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const prev = yield this.query.select({
                    fields: { columns: ['id', 'img'] },
                    table: 'content_images',
                    where: {
                        table: 'content_images',
                        field: 'section',
                        value: `'${section}'`,
                    },
                });
                const body = filename ? { img: filename, link } : { link };
                const data = yield query.update({
                    table: 'content_images',
                    data: body,
                    where: { section: `${section}` },
                });
                if (filename)
                    this.deleteFile.delete('deals', prev[0].img);
                return { success: true, data: { id: prev[0].id, img: filename } };
            }));
        });
    }
}
exports.default = ContentImageServices;
//# sourceMappingURL=contentImageServices.js.map
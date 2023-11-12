"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractUploader_1 = __importDefault(require("./abstractUploader"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const uploader_1 = __importDefault(require("../../utils/uploaders/uploader"));
class NidUploader extends abstractUploader_1.default {
    constructor() {
        super();
        this.uploader = new uploader_1.default(this.allowed_file_types, this.error_message);
    }
    /**
     * upload
     */
    upload(folder) {
        return (req, res, next) => {
            const upload = this.uploader.conpressedUpload();
            upload.any()(req, res, (err) => {
                if (err) {
                    next(new customError_1.default(err.message, 500, 'Upload failed'));
                }
                else {
                    req.upFolder = folder;
                    this.compresser.compresse(folder)(req, res, next);
                }
            });
        };
    }
    /**
     * rawUpload
     */
    rawUpload(folder) {
        return (req, res, next) => {
            const allowed_file_types = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/rtf',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
                'application/vnd.ms-excel',
                'application/vnd.ms-excel.sheet.macroEnabled.12',
                'application/octet-stream',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'video/mp4',
            ];
            const error_message = 'Only .pdf, .JPG, .doc, .docx, , ppt, pptx, pptm, rtf, xlsx, xlsb, xls, xlsm, .jpg, jpeg or .png format allowed!';
            const upload = new uploader_1.default(allowed_file_types, error_message).rawUpload(folder);
            // call the middleware function
            upload.any()(req, res, (err) => {
                if (err) {
                    next(new customError_1.default(err.message, 500, 'Upload failed'));
                }
                else {
                    req.upFolder = folder;
                    next();
                }
            });
        };
    }
}
exports.default = NidUploader;
//# sourceMappingURL=multipleUploader.js.map
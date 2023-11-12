"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const uploader_1 = __importDefault(require("../../utils/uploaders/uploader"));
const abstractUploader_1 = __importDefault(require("./abstractUploader"));
class SingleFileUploader extends abstractUploader_1.default {
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
            // call the middleware function
            upload.single('photo')(req, res, (err) => {
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
    rawUpload(folder, field) {
        return (req, res, next) => {
            const allowed_file_types = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'video/mp4',
                'image/webp',
            ];
            const error_message = 'Only .pdf, .doc, .docx, .jpg,.mp4, .gif, .jpeg or .png format allowed!';
            const upload = new uploader_1.default(allowed_file_types, error_message).rawUpload(folder);
            // call the middleware function
            upload.single(field || 'cv')(req, res, (err) => {
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
exports.default = SingleFileUploader;
//# sourceMappingURL=singleUploaderMw.js.map
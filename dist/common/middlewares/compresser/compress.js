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
const sharp_1 = __importDefault(require("sharp"));
const assyper_1 = __importDefault(require("../assypers/assyper"));
class Compresser {
    constructor() {
        this.smallCompress = (folder, filename) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield (0, sharp_1.default)(`${__dirname}/../../../uploads/${folder}/${filename}`)
                    .resize({ width: 50, height: 50 })
                    .toFile(`${filename}`, (err, file) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return file;
            }
            catch (error) {
                console.log(error);
            }
        });
        this.assyncWrapper = new assyper_1.default();
    }
    compresse(folderPath) {
        return this.assyncWrapper.wrap((req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const uploadsFolder = `${__dirname}/../../../uploads/${folderPath}`;
            const isArray = Object.prototype.toString.call(req.files) === '[object Array]';
            if (req.file) {
                const { buffer } = req.file;
                const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';
                const checkImg = yield (0, sharp_1.default)(buffer).metadata();
                const { width, height } = checkImg;
                let size;
                if (width && height) {
                    // if the width and height is not undefined then proceed further
                    if (width > height) {
                        size = [700, null];
                    }
                    else {
                        size = [null, 700];
                    }
                    yield (0, sharp_1.default)(buffer)
                        .resize(...size, {
                        // background: { r: 255, g: 255, b: 255, alpha: 1 },
                        fit: 'contain',
                    })
                        .toFormat('webp')
                        .withMetadata()
                        .toFile(`${uploadsFolder}/${uniqueName}`);
                    req.file.filename = uniqueName;
                }
                next();
            }
            else if (req.files && isArray && ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                // iterate the files for compressing
                const files = req.files;
                console.log('before', req.files);
                for (let i = 0; i < req.files.length; i++) {
                    const { buffer } = files[i];
                    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';
                    const checkImg = yield (0, sharp_1.default)(buffer).metadata();
                    const { width, height } = checkImg;
                    let size;
                    if (width && height) {
                        // if the width and height is not undefined then proceed further
                        if (width > height) {
                            size = [500, null];
                        }
                        else {
                            size = [null, 500];
                        }
                        yield (0, sharp_1.default)(buffer)
                            .resize(...size, {
                            // background: { r: 243, g: 243, b: 243, alpha: 1 },
                            fit: 'contain',
                        })
                            .rotate()
                            .toFormat('webp')
                            .toFile(`${uploadsFolder}/${uniqueName}`);
                        files[i].filename = uniqueName;
                    }
                }
                req.files = files;
                // send to the next middleware when compression is done
                next();
            }
            else {
                // if there are no image to compress then call send to the next middleware
                next();
            }
        }));
    }
}
exports.default = Compresser;
//# sourceMappingURL=compress.js.map
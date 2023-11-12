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
const fs_1 = __importDefault(require("fs"));
class DeleteFile {
    constructor() {
        this.delete = (dir, files) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof files === 'string') {
                    const strPath = `${__dirname}/../../../uploads/${dir}/${files}`;
                    yield fs_1.default.promises.unlink(strPath);
                }
                else if (files && files.length >= 1) {
                    for (let i = 0; i < files.length; i++) {
                        const filename = files[i];
                        const path = `${__dirname}/../../../uploads/${dir}/${filename}`;
                        yield fs_1.default.promises.unlink(path);
                    }
                }
                else {
                    return;
                }
            }
            catch (err) {
                console.log({ err });
            }
        });
    }
}
exports.default = DeleteFile;
//# sourceMappingURL=deleteFIle.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reqFileSetter_1 = __importDefault(require("../common/middlewares/mini/reqFileSetter"));
const multipleUploader_1 = __importDefault(require("../common/middlewares/uploaders/multipleUploader"));
const singleUploaderMw_1 = __importDefault(require("../common/middlewares/uploaders/singleUploaderMw"));
class AbstractRouter {
    constructor() {
        this.routers = (0, express_1.Router)();
        this.singleUploader = new singleUploaderMw_1.default();
        this.multipleUploader = new multipleUploader_1.default();
        this.reqSetter = new reqFileSetter_1.default();
    }
}
exports.default = AbstractRouter;
//# sourceMappingURL=abstractRouter.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../../utils/errors/customError"));
class Notfound {
    404(_req, _res, next) {
        next(new customError_1.default('Cannot find the route', 404, 'Invalid route'));
    }
}
exports.default = Notfound;
//# sourceMappingURL=notFoundRoute.js.map
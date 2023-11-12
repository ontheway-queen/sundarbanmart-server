"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../common/config/config"));
class AuthChecker {
    constructor() {
        // common auth check
        this.commonAuthCheck = (req, res, next) => {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
                    next();
                }
                catch (err) {
                    res.status(401).json({ success: false, message: 'Invalid Token' });
                }
            }
            else {
                res
                    .status(401)
                    .json({ success: false, message: 'Authentication error!' });
            }
        };
        // queen auth check
        this.queenAuthCheck = (req, res, next) => {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    const check = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
                    req.user = check;
                    // if(check.role)
                    next();
                }
                catch (err) {
                    res.status(401).json({ success: false, message: 'Invalid Token' });
                }
            }
            else {
                res
                    .status(401)
                    .json({ success: false, message: 'Authentication error!' });
            }
        };
        // auth checker for social media
        this.socialAuthCheck = (req, res, next) => {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    const check = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
                    req.user = check;
                    next();
                }
                catch (err) {
                    res.status(401).json({ success: false, message: 'Invalid Token' });
                }
            }
            else {
                res
                    .status(401)
                    .json({ success: false, message: 'Authentication error!' });
            }
        };
        // auth checker for training
        this.trainingAuthCheck = (req, res, next) => {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token) {
                try {
                    const check = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
                    req.user = check;
                    next();
                }
                catch (err) {
                    res.status(401).json({ success: false, message: 'Invalid Token' });
                }
            }
            else {
                res
                    .status(401)
                    .json({ success: false, message: 'Authentication error!' });
            }
        };
    }
}
exports.default = AuthChecker;
//# sourceMappingURL=checkAuth.js.map
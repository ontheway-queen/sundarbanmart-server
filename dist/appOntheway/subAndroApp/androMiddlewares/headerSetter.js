"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeaderSetter {
    setHeader(req, _res, next) {
        req.andro = true;
        next();
    }
}
exports.default = HeaderSetter;
//# sourceMappingURL=headerSetter.js.map
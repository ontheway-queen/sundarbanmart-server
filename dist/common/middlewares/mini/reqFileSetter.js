"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReqFileSetter {
    /**
     * setRequest
     */
    setRequest(req, _res, next) {
        const { filename } = req.file || {};
        const files = req.files;
        if (filename) {
            req.upFiles = filename;
        }
        else if (req.files) {
            let filesToSet = [];
            for (let i = 0; i < files.length; i++) {
                const filename = files[i].filename;
                if (filename) {
                    filesToSet.push(filename);
                }
            }
            req.upFiles = filesToSet;
        }
        next();
    }
}
exports.default = ReqFileSetter;
//# sourceMappingURL=reqFileSetter.js.map
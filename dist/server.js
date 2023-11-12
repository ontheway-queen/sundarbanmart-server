"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./common/config/config"));
const otwRouters_1 = __importDefault(require("./appOntheway/routers/otwRouters"));
const otwRouters = new otwRouters_1.default();
const app = new app_1.default(config_1.default.PORT, otwRouters);
app.listen();
//# sourceMappingURL=server.js.map
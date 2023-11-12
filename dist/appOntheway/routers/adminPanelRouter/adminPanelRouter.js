"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const adminPanelController_1 = __importDefault(require("../../controllers/adminPanelController/adminPanelController"));
const notificationController_1 = __importDefault(require("../../controllers/adminPanelController/notificationController"));
class AdminPanelRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.adminPanelController = new adminPanelController_1.default();
        this.notificatinController = new notificationController_1.default();
        this.login();
        this.notification();
    }
    /**
     * login a user
     */
    login() {
        this.routers.post('/auth/login', this.adminPanelController.login);
    }
    // all notification routers
    notification() {
        this.routers.get('/notification/get/all', this.notificatinController.getAllNotification);
        this.routers.put('/update/notification', this.notificatinController.updateNotification);
        this.routers.delete('/clear/all/notification', this.notificatinController.clearNotifications);
    }
}
exports.default = AdminPanelRouters;
//# sourceMappingURL=adminPanelRouter.js.map
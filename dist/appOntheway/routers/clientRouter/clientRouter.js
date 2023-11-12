"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const clientController_1 = __importDefault(require("../../controllers/clientController/clientController"));
class ClientRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.clientController = new clientController_1.default();
        this.callRouter();
    }
    callRouter() {
        // Post contact msg
        this.routers.post('/send/contact/msg', this.clientController.sendContactMsg);
        // get all contact msg
        this.routers.get('/get/all/contact/msg', this.clientController.getAllContactMsg);
        //get single contact msg
        this.routers.get('/get/single/contact/msg/:id', this.clientController.getSingleContactMsg);
        // update a contact msg
        this.routers.put('/update/contact/msg/:id', this.clientController.updateSingleContactMsg);
    }
}
exports.default = ClientRouters;
//# sourceMappingURL=clientRouter.js.map
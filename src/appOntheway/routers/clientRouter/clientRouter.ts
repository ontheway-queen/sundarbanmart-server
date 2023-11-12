import AbstractRouter from '../../../abstracts/abstractRouter';
import clientController from '../../controllers/clientController/clientController';

class ClientRouters extends AbstractRouter {
  private clientController = new clientController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Post contact msg
    this.routers.post(
      '/send/contact/msg',
      this.clientController.sendContactMsg
    );

    // get all contact msg
    this.routers.get(
      '/get/all/contact/msg',
      this.clientController.getAllContactMsg
    );

    //get single contact msg
    this.routers.get(
      '/get/single/contact/msg/:id',
      this.clientController.getSingleContactMsg
    );

    // update a contact msg
    this.routers.put(
      '/update/contact/msg/:id',
      this.clientController.updateSingleContactMsg
    );
  }
}

export default ClientRouters;

import AbstractRouter from '../../../abstracts/abstractRouter';
import AdminSearchController from '../../controllers/adminController/adminSearchController';

class AdminSearchRouters extends AbstractRouter {
  private adminSearchController = new AdminSearchController();
  constructor() {
    super();
    this.callRouters();
  }

  private callRouters() {
    this.routers.get(
      '/search/:part/:type',
      this.adminSearchController.adminSearch
    );
  }
}

export default AdminSearchRouters;

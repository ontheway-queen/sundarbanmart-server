import AbstractRouter from '../../../abstracts/abstractRouter';
import AdminPanelControllers from '../../controllers/adminPanelController/adminPanelController';
import notificationController from '../../controllers/adminPanelController/notificationController';

class AdminPanelRouters extends AbstractRouter {
  private adminPanelController = new AdminPanelControllers();
  private notificatinController = new notificationController();

  constructor() {
    super();
    this.login();
    this.notification();
  }

  /**
   * login a user
   */

  private login() {
    this.routers.post('/auth/login', this.adminPanelController.login);
  }

  // all notification routers
  private notification() {
    this.routers.get(
      '/notification/get/all',
      this.notificatinController.getAllNotification
    );

    this.routers.put(
      '/update/notification',
      this.notificatinController.updateNotification
    );

    this.routers.delete(
      '/clear/all/notification',
      this.notificatinController.clearNotifications
    );
  }
}

export default AdminPanelRouters;

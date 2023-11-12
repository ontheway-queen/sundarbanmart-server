import AbstractRouter from '../../../abstracts/abstractRouter';
import ExternalController from '../../controllers/externalController/externalController';

class ExternalRouter extends AbstractRouter {
  private externalController = new ExternalController();
  constructor() {
    super();
    this.callRouter();
  }
  // call router
  private callRouter() {
    // atab payment success
    this.routers.post(
      '/payment/success',
      this.externalController.atabPaymentSuccess
    );

    // atab payment failed
    this.routers.get(
      '/payment/failed',
      this.externalController.atabPaymentFailed
    );

    // atab payment cancelled
    this.routers.get(
      '/payment/cancelled',
      this.externalController.atabPaymentCancelled
    );

    // get video api for app test
    this.routers.get(
      '/m360ict/get/video/app/test',
      this.externalController.getVideoAppTest
    );

    // create video api for app test
    this.routers.post(
      '/m360ict/create/video/app/test',
      this.multipleUploader.rawUpload('others'),
      this.externalController.createVideoAppTest
    );
  }
}
export default ExternalRouter;

import AbstractRouter from '../../../abstracts/abstractRouter';
import ContentImagesController from '../../controllers/contentImagesController/contentImagesController';

class ContentImageRouters extends AbstractRouter {
  ContentImageController = new ContentImagesController();
  constructor() {
    super();
    this.callRouters();
  }

  private callRouters() {
    // get section images
    this.routers.get(
      '/get/images/:section',
      this.ContentImageController.getContentImages
    );

    // post or put slider images
    this.routers.put(
      '/add/update/images/:section',
      this.multipleUploader.rawUpload('content_images'),
      this.reqSetter.setRequest,
      this.ContentImageController.postOrUpdateSliderImages
    );

    // Update daily deals imgs
    this.routers.put(
      '/update/image/deals/:section',
      this.singleUploader.rawUpload('daily-deals'),
      this.reqSetter.setRequest,
      this.ContentImageController.updateDailyDealsImg
    );
  }
}

export default ContentImageRouters;

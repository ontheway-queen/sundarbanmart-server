import AbstractRouter from '../../../abstracts/abstractRouter';
import BlogController from '../../controllers/blogController/blogController';

class BlogRouter extends AbstractRouter {
  private blogController = new BlogController();
  constructor() {
    super();
    this.callRouters();
  }

  //call router
  private callRouters() {
    // post a blog for admin
    this.routers.post(
      '/post/admin',
      this.singleUploader.rawUpload('blog_thumbnails', 'thumbnail'),
      this.reqSetter.setRequest,
      this.blogController.postBlogAdmin
    );

    // post a blog for queen
    this.routers.post(
      '/post/queen',
      this.singleUploader.rawUpload('blog_thumbnails', 'thumbnail'),
      this.reqSetter.setRequest,
      this.blogController.postBlogQueen
    );

    // update a blog for admin panel
    this.routers.put(
      '/update/admin/:id',
      this.singleUploader.upload('blog_thumbnails'),
      this.reqSetter.setRequest,
      this.blogController.updateABlogForAdmin
    );

    // update a blog for queen
    this.routers.put(
      '/update/queen/:id',
      this.singleUploader.upload('blog_thumbnails'),
      this.reqSetter.setRequest,
      this.blogController.updateABlogForQueen
    );

    // delete a blog for admin panel
    this.routers.delete(
      '/delete/admin/:id',
      this.blogController.deleteABlogForAdmin
    );

    // delete a blog for queen
    this.routers.delete(
      '/delete/queen/:id',
      this.blogController.deleteABlogForQueen
    );

    // get all blog by type and status and all
    this.routers.get(
      '/get/all/type/status/:type/:status',
      this.blogController.getAllBlogByTypeStatusAll
    );

    // get a single blog for admin or queen
    this.routers.get(
      '/get/single/admin-queen/:id',
      this.blogController.getASingelBlogForAdminQueen
    );

    // get a single blog for public
    this.routers.get(
      '/get/single/:id',
      this.blogController.getASingleBlogForPublic
    );
  }
}
export default BlogRouter;

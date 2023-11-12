import AbstractRouter from '../../../abstracts/abstractRouter';
import AdminProductControllers from '../../controllers/adminController/adminProductControllers';

class AdminProductRouters extends AbstractRouter {
  private adminProductControllers = new AdminProductControllers();

  constructor() {
    super();
    this.callRouters();
  }

  private callRouters() {
    /**
     * get a queens all products
     */
    this.routers.get(
      '/get/all/by-queen/for-queen/:queen_id',
      this.adminProductControllers.getAQueensAllProducts
    );

    // get all product by date range and or status and or category
    this.routers.get(
      '/get/all/date-range/status/category/:status/:category',
      this.adminProductControllers.getAllProductByDateRangeStatusCategory
    );

    /**
     * get a product
     */
    this.routers.get(
      '/get/for-admin/:id',
      this.adminProductControllers.getAProduct
    );

    /**
     * update product
     */
    this.routers.put(
      '/update/:id',
      this.multipleUploader.upload('products'),
      this.reqSetter.setRequest,
      this.adminProductControllers.updateProduct
    );

    //approve product update request
    this.routers.put(
      '/approve/update/:id',
      this.adminProductControllers.approveUpdateProduct
    );

    //reject product update request
    this.routers.put(
      '/reject/update/:id',
      this.adminProductControllers.rejectUpdateProduct
    );

    // get a single product update request
    this.routers.get(
      '/get/update/product/request/:id',
      this.adminProductControllers.getSingleUpdateProduct
    );

    // get a queens all update pending products
    this.routers.get(
      '/get/update/product/request/queen/:id',
      this.adminProductControllers.getQueensUpdateProduct
    );

    /**
     * get all products
     */
    this.routers.get('/get/all', this.adminProductControllers.getAllProducts);

    // get all update pending products
    this.routers.get(
      '/get/all/update/pending/products',
      this.adminProductControllers.getAllUpdatePendingProducts
    );

    // get all products by status
    this.routers.get(
      '/get/all/:status',
      this.adminProductControllers.getAllProductsByStatus
    );

    /**
     *  get all products by category
     */
    this.routers.get(
      '/get/all/for-admin/by-category/:category',
      this.adminProductControllers.getAllProductsByCategory
    );

    /**
     *  get all products by category and status
     */
    this.routers.get(
      '/get/all/for-admin/by-category/:category/:status',
      this.adminProductControllers.getAllProductsByCategoryAndStatus
    );
  }
}

export default AdminProductRouters;

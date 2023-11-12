import AbstractRouter from '../../../abstracts/abstractRouter';
import ProductControllers from '../../controllers/genController/productControllers';

class ProductRouters extends AbstractRouter {
  private productControllers = new ProductControllers();

  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    /**
     *  queen upload product
     */
    this.routers.post(
      '/upload',
      this.multipleUploader.upload('products'),
      this.reqSetter.setRequest,
      this.productControllers.queenUploadProduct
    );

    /**
     *  get a queens all products
     */
    this.routers.get(
      '/get/all/by-queen/:queen_id',
      this.productControllers.getAQueensAllProducts
    );

    /**
     *  get all products by category
     */
    this.routers.get(
      '/get/all/by-category/:category',
      this.productControllers.getAllProductsByCategory
    );

    /**
     *  get a product
     */
    this.routers.get('/get/by-id/:id', this.productControllers.getAProduct);

    /**
     *  queen update product
     */
    this.routers.put(
      '/update/queen/:id',
      this.multipleUploader.upload('products'),
      this.reqSetter.setRequest,
      this.productControllers.queenUpdateProduct
    );

    /**
     *  delete product
     */
    this.routers.delete('/delete/:id', this.productControllers.deleteProduct);

    /**
     *  get all approved products
     */
    this.routers.get(
      '/get/approved/all',
      this.productControllers.getAllApprovedProducts
    );

    /**
     *  search products
     */
    this.routers.get('/search', this.productControllers.searchProducts);
  }
}

export default ProductRouters;

import Queries from '../common/dataAccess/queries';
import DeleteFile from '../common/utils/fileRemover/deleteFIle';
import Transaction from '../common/utils/transaction/transaction';
import DbAccess from '../common/dataAccess/dbAccess';
import ManageFile from '../common/utils/manageFile/manageFile';
import { dbCon } from '../otwDb';

abstract class AbstractServices {
  protected query: Queries;
  protected deleteFile: DeleteFile;
  protected transaction: Transaction;
  private dbAccess = new DbAccess(dbCon);
  protected manageFile: ManageFile;

  constructor() {
    this.query = new Queries(this.dbAccess);
    this.deleteFile = new DeleteFile();
    this.transaction = new Transaction(this.dbAccess);
    this.manageFile = new ManageFile();
  }
}

export default AbstractServices;

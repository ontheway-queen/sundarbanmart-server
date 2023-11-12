import OtwDb from '../../otwDb';

class DbAccess {
  public instance;
  constructor(db: OtwDb) {
    this.instance = db;
  }
}

export default DbAccess;

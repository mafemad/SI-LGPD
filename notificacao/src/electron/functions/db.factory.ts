import { DataSource } from "typeorm";
import { User } from "./entity/User.js";

export default class DBFactory {
  private static instance: DBFactory;
  private db: DataSource;
  private static dbPath: string;

  private constructor(dbPath: string) {
    this.db = new DataSource({
      type: "better-sqlite3",
      database: dbPath,
      entities: [User],
      synchronize: true,
    });
  }

  public static async getInstance(dbPath?: string): Promise<DBFactory> {
    if (!DBFactory.instance) {
      DBFactory.instance = new DBFactory(dbPath || this.dbPath);
      await DBFactory.instance.db.initialize();
    }
    return DBFactory.instance;
  }

  public getDataSource(): DataSource {
    return this.db;
  }
}

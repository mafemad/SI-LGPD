import { DataSource } from "typeorm";
import { User } from "./entity/User.js";
export default class DBFactory {
    static instance;
    db;
    static dbPath;
    constructor(dbPath) {
        this.db = new DataSource({
            type: "better-sqlite3",
            database: dbPath,
            entities: [User],
            synchronize: true,
        });
    }
    static async getInstance(dbPath) {
        if (!DBFactory.instance) {
            DBFactory.instance = new DBFactory(dbPath || this.dbPath);
            await DBFactory.instance.db.initialize();
        }
        return DBFactory.instance;
    }
    getDataSource() {
        return this.db;
    }
}

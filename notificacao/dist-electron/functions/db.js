import { DataSource } from "typeorm";
import { User } from "./entity/User.js";
const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    entities: [User],
    synchronize: true,
});
export { AppDataSource };

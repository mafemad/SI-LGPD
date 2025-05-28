import { DataSource } from "typeorm";
import { User } from "./entity/User.js";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User],
  synchronize: true,
});

export { AppDataSource };

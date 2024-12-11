import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
const { PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;

const AppSource = new DataSource({
  username: PG_USERNAME,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  type: "postgres",
  synchronize: false,
  migrationsRun: true,
  entities: ["dist/entities/*.entity.{ts,js}"],
  migrations: ["dist/migration/**/*.{ts,js}"],
  migrationsTableName: "migrations",
});

//Only need to pass name of the file
// "migration:generate": "yarn run build && yarn run typeorm -- migration:generate -d dist/datasource/datasource.js ./src/migration",
// yarn migration:generate role-added

// have to pass the path along with migration name
// yarn migration:generate ./src/migration/user-role
// yarn run migration:run
export default AppSource;

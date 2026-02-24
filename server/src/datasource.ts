import { DataSource } from "typeorm";
import path from "path";
import fs from "fs";

// Chemin absolu pour éviter SQLITE_READONLY_DBMOVED (dossier sync / chemin relatif)
const dbDir = path.resolve(__dirname, "..", "data");
const dbPath = path.join(dbDir, "db.sqlite");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const datasource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  entities: [path.join(__dirname, "entities", "**", "*.{js,ts}")],
  logging: true,
  synchronize: true,
});

export default datasource;

// importamos la librería de sqlite y el driver
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Función que abrirá la bbdd
export async function openDB() {
  return open({
    filename: "./src/db/database.db",
    driver: sqlite3.Database
  });
}

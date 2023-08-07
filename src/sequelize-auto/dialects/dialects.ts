import { mssqlOptions } from './mssql';
import { mysqlOptions } from './mysql';
import { postgresOptions } from './postgres';
import { sqliteOptions } from './sqlite';
import { DialectOptions } from './dialect-options';
import { Dialect } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const dialects: { [name in Dialect]: DialectOptions } = {
  mssql: mssqlOptions,
  mysql: mysqlOptions,
  mariadb: mysqlOptions,
  postgres: postgresOptions,
  sqlite: sqliteOptions,
};

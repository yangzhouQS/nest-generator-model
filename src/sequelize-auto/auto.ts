import * as $lodash from 'lodash';
import { Dialect, Sequelize } from 'sequelize';
import { AutoBuilder } from './auto-builder';
import { AutoGenerator } from './auto-generator';
import { AutoRelater } from './auto-relater';
import { AutoWriter } from './auto-writer';
import { dialects } from './dialects/dialects';
import { AutoOptions, TableData } from './types';

export class SequelizeAuto {
  sequelize: Sequelize;
  options: AutoOptions;

  constructor(
    database: string | Sequelize,
    username: string,
    password: string,
    options: AutoOptions,
  ) {
    if (
      options &&
      options.dialect === 'sqlite' &&
      !options.storage &&
      database
    ) {
      options.storage = database as string;
    }
    if (options && options.dialect === 'mssql') {
      // set defaults for tedious, to silence the warnings
      options.dialectOptions = options.dialectOptions || {};
      options.dialectOptions.options = options.dialectOptions.options || {};
      options.dialectOptions.options.trustServerCertificate = true;
      options.dialectOptions.options.enableArithAbort = true;
      options.dialectOptions.options.validateBulkLoadParameters = true;
    }

    if (database instanceof Sequelize) {
      this.sequelize = database;
    } else {
      this.sequelize = new Sequelize(
        database,
        username,
        password,
        options || {},
      );
    }

    const defaultOptions = {
      spaces: true,
      indentation: 2,
      directory: './models',
      additional: {},
      host: 'localhost',
      port: 3306,
      closeConnectionAutomatically: true,
    };
    // this.options = Object.assign(defaultOptions, options || {}) as AutoOptions;
    this.options = $lodash.extend(defaultOptions, options || {});

    if (!this.options.directory) {
      this.options.noWrite = true;
    }
  }

  async run(): Promise<TableData> {
    let td = await this.build();
    td = this.relate(td);
    td.text = this.generate(td);
    await this.write(td);
    return td;
  }

  build(): Promise<TableData> {
    const builder = new AutoBuilder(this.sequelize, this.options);
    return builder.build().then((tableData) => {
      if (this.options.closeConnectionAutomatically) {
        return this.sequelize.close().then(() => tableData);
      }
      return tableData;
    });
  }

  relate(td: TableData): TableData {
    const relater = new AutoRelater(this.options);
    return relater.buildRelations(td);
  }

  generate(tableData: TableData) {
    const dialect = dialects[this.sequelize.getDialect() as Dialect];
    const generator = new AutoGenerator(tableData, dialect, this.options);
    return generator.generateText();
  }

  /**
   * 生成文件持久化保存
   * @param tableData
   */
  write(tableData: TableData) {
    const writer = new AutoWriter(tableData, this.options);
    return writer.write();
  }
}
module.exports = SequelizeAuto;
module.exports.SequelizeAuto = SequelizeAuto;
module.exports.default = SequelizeAuto;

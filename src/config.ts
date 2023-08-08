export const config = {
  spaces: true,
  indentation: 2,
  directory: './models',
  additional: {
    // 时间字段处理
    timestamps: false,
    paranoid: false,
  },
  dialect: 'mysql',
  port: 3306,
  host: '127.0.0.1',
  database: 'nba',
  storage: 'nba',
  tables: null,
  skipTables: null,
  skipFields: null,
  pkSuffixes: null,
  lang: 'es5',
  caseModel: 'c', // init-models导出变量命名规则
  caseFile: 'k', // 输出文件名规则
  caseProp: 'c', // 字段属性命名规则
  noAlias: false,
  noInitModels: false,
  noWrite: false, // 不写入文件
  views: false,
  singularize: false,
  password: 'root',
  username: 'root',
  useDefine: true,
  noIndexes: false,

  // 是否设置字段特殊函数默认值
  isFieldUpdateFn: true,
  isFieldDefaultFn: true,
};
/*

Options:
    --help               Show help                                   [boolean]
    --version            Show version number                         [boolean]
-h, --host               IP/Hostname for the database.                [string]
-d, --database           Database name.                               [string]
-u, --user               Username for database.                       [string]
-x, --pass               Password for database. If specified without providing
                          a password, it will be requested interactively from
                          the terminal.
-p, --port               Port number for database (not for sqlite). Ex:
                          MySQL/MariaDB: 3306, Postgres: 5432, MSSQL: 1433
                                                                      [number]
-c, --config             Path to JSON file for Sequelize-Auto options and
                          Sequelize's constructor "options" flag object as
                          defined here:
                          https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
                                                                      [string]
-o, --output             What directory to place the models.          [string]
-e, --dialect            The dialect/engine that you're using: postgres,
                          mysql, sqlite, mssql                         [string]
-a, --additional         Path to JSON file containing model options (for all
                          tables). See the options: https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
                                                                      [string]
    --indentation        Number of spaces to indent                   [number]
-t, --tables             Space-separated names of tables to import     [array]
-T, --skipTables         Space-separated names of tables to skip       [array]
--caseModel, --cm        Set case of model names: c|l|o|p|u
                          c = camelCase
                          l = lower_case
                          o = original (default)
                          p = PascalCase
                          u = UPPER_CASE
--caseProp, --cp         Set case of property names: c|l|o|p|u
--caseFile, --cf         Set case of file names: c|l|o|p|u|k
                          k = kebab-case
--noAlias                Avoid creating alias `as` property in relations
                                                                     [boolean]
--noInitModels           Prevent writing the init-models file        [boolean]
-n, --noWrite            Prevent writing the models to disk          [boolean]
-s, --schema             Database schema from which to retrieve tables[string]
-v, --views              Include database views in generated models  [boolean]
-l, --lang               Language for Model output: es5|es6|esm|ts
                          es5 = ES5 CJS modules (default)
                          es6 = ES6 CJS modules
                          esm = ES6 ESM modules
                          ts = TypeScript                             [string]
--useDefine              Use `sequelize.define` instead of `init` for es6|esm|ts
--singularize, --sg      Singularize model and file names from plural table
                          names                                      [boolean]


*/

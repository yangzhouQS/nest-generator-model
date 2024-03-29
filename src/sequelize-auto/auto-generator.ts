import * as _ from 'lodash';
import { ColumnDescription } from 'sequelize/types';
import { DialectOptions, FKSpec } from './dialects/dialect-options';
import {
  AutoOptions,
  CaseFileOption,
  CaseOption,
  Field,
  IndexSpec,
  LangOption,
  makeIndent,
  makeTableName,
  pluralize,
  qNameJoin,
  qNameSplit,
  recase,
  Relation,
  singularize,
  TableData,
  TSField,
} from './types';

/** Generates text from each table in TableData */
export class AutoGenerator {
  tableData: TableData;
  dialect: DialectOptions;
  tables: { [tableName: string]: { [fieldName: string]: ColumnDescription } };
  foreignKeys: { [tableName: string]: { [fieldName: string]: FKSpec } };
  hasTriggerTables: { [tableName: string]: boolean };
  indexes: { [tableName: string]: IndexSpec[] };
  relations: Relation[];
  space: string[];
  options: {
    indentation?: number;
    spaces?: boolean;
    lang?: LangOption;
    caseModel?: CaseOption;
    caseProp?: CaseOption;
    caseFile?: CaseFileOption;
    skipFields?: string[];
    additional?: any;
    schema?: string;
    singularize: boolean;
    useDefine: boolean;
    noIndexes?: boolean;

    // 模型字段特殊属性
    isFieldUpdateFn?: boolean;
    isFieldDefaultFn?: boolean;
  };

  constructor(
    tableData: TableData,
    dialect: DialectOptions,
    options: AutoOptions,
  ) {
    this.tableData = tableData;
    this.tables = tableData.tables;
    this.foreignKeys = tableData.foreignKeys;
    this.hasTriggerTables = tableData.hasTriggerTables;
    this.indexes = tableData.indexes;
    this.relations = tableData.relations;
    this.dialect = dialect;
    this.options = options;
    this.options.lang = this.options.lang || 'es5';
    this.space = makeIndent(this.options.spaces, this.options.indentation);
  }

  /**
   * 模板头部
   */
  makeHeaderTemplate(table: string) {
    const tableComment = this.tableData.tableComments[table];

    let header = '';
    const sp = this.space[1];

    if (this.options.lang === 'ts') {
      header += "import * as Sequelize from 'sequelize';\n";
      header += "import { DataTypes, Model, Optional } from 'sequelize';\n";
    } else if (this.options.lang === 'es6') {
      header += "const Sequelize = require('sequelize');\n";
      header += 'module.exports = (sequelize, DataTypes) => {\n';
      header += sp + 'return #TABLE#.init(sequelize, DataTypes);\n';
      header += '}\n\n';
      header += 'class #TABLE# extends Sequelize.Model {\n';
      header += sp + 'static init(sequelize, DataTypes) {\n';
      if (this.options.useDefine) {
        header += sp + "return sequelize.define('#TABLE#', {\n";
      } else {
        header += sp + 'return super.init({\n';
      }
    } else if (this.options.lang === 'esm') {
      header += "import _sequelize from 'sequelize';\n";
      header += 'const { Model, Sequelize } = _sequelize;\n\n';
      header += 'export default class #TABLE# extends Model {\n';
      header += sp + 'static init(sequelize, DataTypes) {\n';
      if (this.options.useDefine) {
        header += sp + "return sequelize.define('#TABLE#', {\n";
      } else {
        header += sp + 'return super.init({\n';
      }
    } else if (this.options.lang === 'es5') {
      header += `const Sequelize = require('@mctech/sequelize-impala');\n\n`;
      if (tableComment) {
        header += `// ${tableComment}\n`;
      }
      header += 'module.exports = {\n';
      header += sp + `name: '#TABLE#',\n`;
      header += sp + 'fields: {\n';
    } else {
      header += "const Sequelize = require('sequelize');\n";
      header += 'module.exports = function(sequelize, DataTypes) {\n';
      header += sp + "return sequelize.define('#TABLE#', {\n";
    }
    return header;
  }

  /**
   * 字段模型生成
   */
  generateText() {
    // 原始表名称
    const tableNames = _.keys(this.tables);

    const modelText: { [name: string]: string } = {};
    const serviceText: { [name: string]: string } = {};
    const routerText: { [name: string]: string } = {};

    tableNames.forEach((table) => {
      // 模型公共导入部分生成
      const header = this.makeHeaderTemplate(table);

      let str = header;
      const [schemaName, tableNameOrig] = qNameSplit(table);

      // 模型名称规则转换
      const tableName = makeTableName(
        this.options.caseModel,
        tableNameOrig,
        this.options.singularize,
        this.options.lang,
      );

      // 单表处理
      str += this.addTable(table);

      const re = new RegExp('#TABLE#', 'g');
      // console.log(str);
      str = str.replace(re, tableName);

      modelText[table] = str;
      serviceText[table] = str;
      routerText[table] = str;
    });

    return { modelText, serviceText, routerText };
  }

  // Create a string for the model of the table
  private addTable(table: string) {
    const [schemaName, tableNameOrig] = qNameSplit(table);
    const space = this.space;
    let timestamps =
      (this.options.additional &&
        this.options.additional.timestamps === true) ||
      false;
    let paranoid =
      (this.options.additional && this.options.additional.paranoid === true) ||
      false;

    // add all the fields
    let str = '';

    // 表格所有字段
    const fields = _.keys(this.tables[table]);
    console.log(table, fields.length);
    fields.forEach((field, index) => {
      timestamps ||= this.isTimestampField(field);

      paranoid ||= this.isParanoidField(field);

      // 单个字段处理
      str += this.addField(table, field, index);
    });

    // trim off last ",\n"
    str = str.substring(0, str.length - 2) + '\n';

    str += space[0] + '}';

    /*
    // add the table options
    str += space[1] + '}, {\n';
    if (!this.options.useDefine) {
      str += space[2] + 'sequelize,\n';
    }
    str += space[2] + "tableName: '" + tableNameOrig + "',\n";

    if (schemaName && this.dialect.hasSchema) {
      str += space[2] + "schema: '" + schemaName + "',\n";
    }

    if (this.hasTriggerTables[table]) {
      str += space[2] + 'hasTrigger: true,\n';
    }

    str += space[2] + 'timestamps: ' + timestamps + ',\n';
    if (paranoid) {
      str += space[2] + 'paranoid: true,\n';
    }

    // conditionally add additional options
    const hasadditional =
      _.isObject(this.options.additional) &&
      _.keys(this.options.additional).length > 0;
    if (hasadditional) {
      _.each(this.options.additional, (value, key) => {
        if (key === 'name') {
          // name: true - preserve table name always
          str += space[2] + 'name: {\n';
          str += space[3] + "singular: '" + table + "',\n";
          str += space[3] + "plural: '" + table + "'\n";
          str += space[2] + '},\n';
        } else if (key === 'timestamps' || key === 'paranoid') {
          // handled above
        } else {
          value = _.isBoolean(value) ? value : "'" + value + "'";
          str += space[2] + key + ': ' + value + ',\n';
        }
      });
    }

    */

    // add indexes
    /*if (!this.options.noIndexes) {
      str += this.addIndexes(table);
    }*/

    str = space[2] + str.trim();
    str = str.substring(0, str.length - 1);
    str += space[1] + '}';

    // 在此处添加details字段

    str += '\n' + '}';

    return str;
  }

  // Create a string containing field attributes (type, defaultValue, etc.)
  /**
   * 字段生成处理，主键，类型，注释，默认值
   * 单个字段处理，需要循环调用
   * @param table
   * @param field
   * @private
   */
  private addField(table: string, field: string, index: number): string {
    // ignore Sequelize standard fields
    const additional = this.options.additional;
    if (
      additional &&
      additional.timestamps !== false &&
      (this.isTimestampField(field) || this.isParanoidField(field))
    ) {
      return '';
    }

    if (this.isIgnoredField(field)) {
      return '';
    }

    // Find foreign key
    const foreignKey =
      this.foreignKeys[table] && this.foreignKeys[table][field]
        ? this.foreignKeys[table][field]
        : null;
    const fieldObj = this.tables[table][field] as Field;

    if (_.isObject(foreignKey)) {
      fieldObj.foreignKey = foreignKey;
    }

    const fieldName = recase(this.options.caseProp, field);
    let str = this.quoteName(fieldName) + ': {\n';

    const quoteWrapper = '"';

    // const unique = fieldObj.unique || (fieldObj.foreignKey && fieldObj.foreignKey.isUnique);

    const isSerialKey =
      (fieldObj.foreignKey && fieldObj.foreignKey.isSerialKey) ||
      (this.dialect.isSerialKey && this.dialect.isSerialKey(fieldObj));

    let wroteAutoIncrement = false;
    const space = this.space;

    // column's attributes
    const fieldAttrs = _.keys(fieldObj);
    fieldAttrs.forEach((attr) => {
      // We don't need the special attribute from postgresql; "unique" is handled separately
      if (attr === 'special' || attr === 'elementType' || attr === 'unique') {
        return true;
      }

      // 主键自增 autoIncrement,
      if (isSerialKey && !wroteAutoIncrement) {
        str += space[3] + 'autoIncrement: true,\n';
        wroteAutoIncrement = true;
      }

      if (attr === 'foreignKey') {
        return true;
      } else if (attr === 'references') {
        return true;
      } else if (attr === 'primaryKey') {
        if (
          fieldObj[attr] === true &&
          (!_.has(fieldObj, 'foreignKey') || !!fieldObj.foreignKey.isPrimaryKey)
        ) {
          str += space[3] + 'primaryKey: true';
        } else {
          return true;
        }
      } else if (attr === 'autoIncrement') {
        /*if (fieldObj[attr] === true && !wroteAutoIncrement) {
          str += space[3] + 'autoIncrement: true,\n';
          wroteAutoIncrement = true;
        }*/
        return true;
      } else if (attr === 'allowNull') {
        // 不允许为null, 主键不允许为null，其他字段跳过设置
        if (!fieldObj[attr]) {
          str += space[3] + attr + ': ' + fieldObj[attr];
        } else {
          return true;
        }
      } else if (attr === 'defaultValue') {
        // 默认值设置
        let defaultVal = fieldObj.defaultValue;

        if (defaultVal === null || defaultVal === undefined) {
          return true;
        }
        if (isSerialKey) {
          return true; // value generated in the database
        }

        let val_text = defaultVal;
        if (_.isString(defaultVal)) {
          const field_type = fieldObj.type.toLowerCase();
          defaultVal = this.escapeSpecial(defaultVal);

          while (defaultVal.startsWith('(') && defaultVal.endsWith(')')) {
            // remove extra parens around mssql defaults
            defaultVal = defaultVal.replace(/^[(]/, '').replace(/[)]$/, '');
          }

          if (
            field_type === 'bit(1)' ||
            field_type === 'bit' ||
            field_type === 'boolean'
          ) {
            // convert string to boolean
            val_text = /1|true/i.test(defaultVal) ? 'true' : 'false';
          } else if (this.isArray(field_type)) {
            // remove outer {}
            val_text = defaultVal.replace(/^{/, '').replace(/}$/, '');
            if (val_text && this.isString(fieldObj.elementType)) {
              // quote the array elements
              val_text = val_text
                .split(',')
                .map((s) => `"${s}"`)
                .join(',');
            }
            val_text = `[${val_text}]`;
          } else if (field_type.match(/^(json)/)) {
            // don't quote json
            val_text = defaultVal;
          } else if (
            field_type === 'uuid' &&
            (defaultVal === 'gen_random_uuid()' ||
              defaultVal === 'uuid_generate_v4()')
          ) {
            val_text = 'DataTypes.UUIDV4';
          } else if (defaultVal.match(/\w+\(\)$/)) {
            // replace db function with sequelize function
            val_text =
              "Sequelize.Sequelize.fn('" +
              defaultVal.replace(/\(\)$/g, '') +
              "')";
          } else if (this.isNumber(field_type)) {
            if (defaultVal.match(/\(\)/g)) {
              // assume it's a server function if it contains parens
              val_text = "Sequelize.Sequelize.literal('" + defaultVal + "')";
            } else {
              // don't quote numbers
              val_text = defaultVal;
            }
          } else if (defaultVal.match(/\(\)/g)) {
            // embedded function, pass as literal
            val_text = "Sequelize.Sequelize.literal('" + defaultVal + "')";
          } else if (
            field_type.indexOf('date') === 0 ||
            field_type.indexOf('timestamp') === 0
          ) {
            if (
              _.includes(
                [
                  'current_timestamp',
                  'current_date',
                  'current_time',
                  'localtime',
                  'localtimestamp',
                ],
                defaultVal.toLowerCase(),
              )
            ) {
              val_text = "Sequelize.Sequelize.literal('" + defaultVal + "')";
            } else {
              val_text = quoteWrapper + defaultVal + quoteWrapper;
            }
          } else {
            val_text = quoteWrapper + defaultVal + quoteWrapper;
          }
        }

        // val_text = _.isString(val_text) && !val_text.match(/^sequelize\.[^(]+\(.*\)$/)
        // ? self.sequelize.escape(_.trim(val_text, '"'), null, self.options.dialect)
        // : val_text;
        // don't prepend N for MSSQL when building models...
        // defaultVal = _.trimStart(defaultVal, 'N');

        str += space[3] + attr + ': ' + val_text;
      } else if (attr === 'comment') {
        const val = fieldObj[attr];
        if (val !== null) {
          str += space[3] + `comment: '${fieldObj[attr]}',\n`;
        } else {
          str += space[3] + `comment: '',\n`;
        }
        return true;
      } else if (attr === 'type') {
        const val = this.getSqType(fieldObj, attr);
        str += space[3] + attr + ': ' + val + ',\n';
        return true;
      } else {
        let val = (fieldObj as any)[attr];
        val = _.isString(val)
          ? quoteWrapper + this.escapeSpecial(val) + quoteWrapper
          : val;
        str += space[3] + attr + ': ' + val;
        console.log(val);
      }

      str += ',\n';
    });

    const _field = recase('c', field);
    // 设置 defaultFn,updateFn
    if (this.options.isFieldDefaultFn) {
      if (_field === 'id') {
        str += space[3] + `defaultFn: 'id',\n`;
      }
      if (_field === 'creatorId') {
        str += space[3] + `defaultFn: 'userId',\n`;
      }
      if (_field === 'creatorName') {
        str += space[3] + `defaultFn: 'uerName',\n`;
      }
    }
    if (this.options.isFieldUpdateFn) {
      if (_field === 'modifierId') {
        str += space[3] + `updateFn: 'userId',\n`;
        str += space[3] + `defaultEqual: 'creatorId',\n`;
      }
      if (_field === 'modifierName') {
        str += space[3] + `updateFn: 'uerName',\n`;
        str += space[3] + `defaultEqual: 'creatorName',\n`;
      }
      if (_field === 'updatedAt') {
        str += space[3] + `updateFn: 'now',\n`;
      }
      if (_field === 'version') {
        str += space[3] + `updateFn: 'id',\n`;
        str += space[3] + `defaultEqual: 'id',\n`;
      }
    }

    // removes the last `,` within the attribute options
    str = str.trim().replace(/,+$/, '') + '\n';
    str = space[2] + str + space[2] + '},\n';
    return str;
  }

  private addIndexes(table: string) {
    const indexes = this.indexes[table];
    const space = this.space;
    let str = '';
    if (indexes && indexes.length) {
      str += space[2] + 'indexes: [\n';
      indexes.forEach((idx) => {
        str += space[3] + '{\n';
        if (idx.name) {
          str += space[4] + `name: "${idx.name}",\n`;
        }
        if (idx.unique) {
          str += space[4] + 'unique: true,\n';
        }
        if (idx.type) {
          if (['UNIQUE', 'FULLTEXT', 'SPATIAL'].includes(idx.type)) {
            str += space[4] + `type: "${idx.type}",\n`;
          } else {
            str += space[4] + `using: "${idx.type}",\n`;
          }
        }
        str += space[4] + `fields: [\n`;
        idx.fields.forEach((ff) => {
          str += space[5] + `{ name: "${ff.attribute}"`;
          if (ff.collate) {
            str += `, collate: "${ff.collate}"`;
          }
          if (ff.length) {
            str += `, length: ${ff.length}`;
          }
          if (ff.order && ff.order !== 'ASC') {
            str += `, order: "${ff.order}"`;
          }
          str += ' },\n';
        });
        str += space[4] + ']\n';
        str += space[3] + '},\n';
      });
      str += space[2] + '],\n';
    }
    return str;
  }

  /** Get the sequelize type from the Field */
  private getSqType(fieldObj: Field, attr: string): string {
    const attrValue = (fieldObj as any)[attr];
    if (!attrValue.toLowerCase) {
      console.log('attrValue', attr, attrValue);
      return attrValue;
    }
    const type: string = attrValue.toLowerCase();
    const length = type.match(/\(\d+\)/);
    const precision = type.match(/\(\d+,\d+\)/);
    let val = null;
    let typematch = null;

    if (
      type === 'boolean' ||
      type === 'bit(1)' ||
      type === 'bit' ||
      type === 'tinyint(1)'
    ) {
      val = 'Sequelize.BOOLEAN';

      // postgres range types
    } else if (type === 'numrange') {
      val = 'Sequelize.RANGE(DataTypes.DECIMAL)';
    } else if (type === 'int4range') {
      val = 'Sequelize.RANGE(DataTypes.INTEGER)';
    } else if (type === 'int8range') {
      val = 'Sequelize.RANGE(DataTypes.BIGINT)';
    } else if (type === 'daterange') {
      val = 'Sequelize.RANGE(DataTypes.DATEONLY)';
    } else if (type === 'tsrange' || type === 'tstzrange') {
      val = 'Sequelize.RANGE(DataTypes.DATE)';
    } else if (
      (typematch = type.match(/^(bigint|smallint|mediumint|tinyint|int)/))
    ) {
      // integer subtypes
      val =
        'Sequelize.' +
        (typematch[0] === 'int' ? 'INTEGER' : typematch[0].toUpperCase());
      if (/unsigned/i.test(type)) {
        val += '.UNSIGNED';
      }
      if (/zerofill/i.test(type)) {
        val += '.ZEROFILL';
      }
    } else if (type === 'nvarchar(max)' || type === 'varchar(max)') {
      val = 'Sequelize.TEXT';
    } else if (type.match(/n?varchar|string|varying/)) {
      val = 'Sequelize.STRING' + (!_.isNull(length) ? length : '');
    } else if (type.match(/^n?char/)) {
      val = 'Sequelize.CHAR' + (!_.isNull(length) ? length : '');
    } else if (type.match(/^real/)) {
      val = 'Sequelize.REAL';
    } else if (type.match(/text$/)) {
      val = 'Sequelize.TEXT' + (!_.isNull(length) ? length : '');
    } else if (type === 'date') {
      val = 'Sequelize.DATEONLY';
    } else if (type.match(/^(date|timestamp|year)/)) {
      val = 'Sequelize.DATE' + (!_.isNull(length) ? length : '');
    } else if (type.match(/^(time)/)) {
      val = 'Sequelize.TIME';
    } else if (type.match(/^(float|float4)/)) {
      val = 'Sequelize.FLOAT' + (!_.isNull(precision) ? precision : '');
    } else if (type.match(/^(decimal|numeric)/)) {
      val = 'Sequelize.DECIMAL' + (!_.isNull(precision) ? precision : '');
    } else if (type.match(/^money/)) {
      val = 'Sequelize.DECIMAL(19,4)';
    } else if (type.match(/^smallmoney/)) {
      val = 'Sequelize.DECIMAL(10,4)';
    } else if (type.match(/^(float8|double)/)) {
      val = 'Sequelize.DOUBLE' + (!_.isNull(precision) ? precision : '');
    } else if (type.match(/^uuid|uniqueidentifier/)) {
      val = 'Sequelize.UUID';
    } else if (type.match(/^jsonb/)) {
      val = 'Sequelize.JSONB';
    } else if (type.match(/^json/)) {
      val = 'Sequelize.JSON';
    } else if (type.match(/^geometry/)) {
      const gtype = fieldObj.elementType ? `(${fieldObj.elementType})` : '';
      val = `Sequelize.GEOMETRY${gtype}`;
    } else if (type.match(/^geography/)) {
      const gtype = fieldObj.elementType ? `(${fieldObj.elementType})` : '';
      val = `Sequelize.GEOGRAPHY${gtype}`;
    } else if (type.match(/^array/)) {
      const eltype = this.getSqType(fieldObj, 'elementType');
      val = `Sequelize.ARRAY(${eltype})`;
    } else if (type.match(/(binary|image|blob|bytea)/)) {
      val = 'Sequelize.BLOB';
    } else if (type.match(/^hstore/)) {
      val = 'Sequelize.HSTORE';
    } else if (type.match(/^inet/)) {
      val = 'Sequelize.INET';
    } else if (type.match(/^cidr/)) {
      val = 'Sequelize.CIDR';
    } else if (type.match(/^oid/)) {
      val = 'Sequelize.INTEGER';
    } else if (type.match(/^macaddr/)) {
      val = 'Sequelize.MACADDR';
    } else if (type.match(/^enum(\(.*\))?$/)) {
      const enumValues = this.getEnumValues(fieldObj);
      val = `Sequelize.ENUM(${enumValues})`;
    }

    return val as string;
  }

  private getTypeScriptPrimaryKeys(table: string): Array<string> {
    const fields = _.keys(this.tables[table]);
    return fields.filter((field): boolean => {
      const fieldObj = this.tables[table][field];
      return fieldObj['primaryKey'];
    });
  }

  private getTypeScriptCreationOptionalFields(table: string): Array<string> {
    const fields = _.keys(this.tables[table]);
    return fields.filter((field): boolean => {
      const fieldObj = this.tables[table][field];
      return (
        fieldObj.allowNull ||
        !!fieldObj.defaultValue ||
        fieldObj.defaultValue === '' ||
        fieldObj.autoIncrement ||
        this.isTimestampField(field)
      );
    });
  }

  /** Add schema to table so it will match the relation data.  Fixes mysql problem. */
  private addSchemaForRelations(table: string) {
    if (
      !table.includes('.') &&
      !this.relations.some((rel) => rel.childTable === table)
    ) {
      // if no tables match the given table, then assume we need to fix the schema
      const first = this.relations.find((rel) => !!rel.childTable);
      if (first) {
        const [schemaName, tableName] = qNameSplit(first.childTable);
        if (schemaName) {
          table = qNameJoin(schemaName, table);
        }
      }
    }
    return table;
  }

  private addTypeScriptAssociationMixins(table: string): Record<string, any> {
    const sp = this.space[1];
    const needed: Record<string, Set<string>> = {};
    let str = '';

    table = this.addSchemaForRelations(table);

    this.relations.forEach((rel) => {
      if (!rel.isM2M) {
        if (rel.childTable === table) {
          // current table is a child that belongsTo parent
          const pparent = _.upperFirst(rel.parentProp);
          str += `${sp}// ${rel.childModel} belongsTo ${rel.parentModel} via ${rel.parentId}\n`;
          str += `${sp}${rel.parentProp}!: ${rel.parentModel};\n`;
          str += `${sp}get${pparent}!: Sequelize.BelongsToGetAssociationMixin<${rel.parentModel}>;\n`;
          str += `${sp}set${pparent}!: Sequelize.BelongsToSetAssociationMixin<${rel.parentModel}, ${rel.parentModel}Id>;\n`;
          str += `${sp}create${pparent}!: Sequelize.BelongsToCreateAssociationMixin<${rel.parentModel}>;\n`;
          needed[rel.parentTable] ??= new Set();
          needed[rel.parentTable].add(rel.parentModel);
          needed[rel.parentTable].add(rel.parentModel + 'Id');
        } else if (rel.parentTable === table) {
          needed[rel.childTable] ??= new Set();
          const pchild = _.upperFirst(rel.childProp);
          if (rel.isOne) {
            // const hasModelSingular = singularize(hasModel);
            str += `${sp}// ${rel.parentModel} hasOne ${rel.childModel} via ${rel.parentId}\n`;
            str += `${sp}${rel.childProp}!: ${rel.childModel};\n`;
            str += `${sp}get${pchild}!: Sequelize.HasOneGetAssociationMixin<${rel.childModel}>;\n`;
            str += `${sp}set${pchild}!: Sequelize.HasOneSetAssociationMixin<${rel.childModel}, ${rel.childModel}Id>;\n`;
            str += `${sp}create${pchild}!: Sequelize.HasOneCreateAssociationMixin<${rel.childModel}>;\n`;
            needed[rel.childTable].add(rel.childModel);
            needed[rel.childTable].add(`${rel.childModel}Id`);
            needed[rel.childTable].add(`${rel.childModel}CreationAttributes`);
          } else {
            const hasModel = rel.childModel;
            const sing = _.upperFirst(singularize(rel.childProp));
            const lur = pluralize(rel.childProp);
            const plur = _.upperFirst(lur);
            str += `${sp}// ${rel.parentModel} hasMany ${rel.childModel} via ${rel.parentId}\n`;
            str += `${sp}${lur}!: ${rel.childModel}[];\n`;
            str += `${sp}get${plur}!: Sequelize.HasManyGetAssociationsMixin<${hasModel}>;\n`;
            str += `${sp}set${plur}!: Sequelize.HasManySetAssociationsMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}add${sing}!: Sequelize.HasManyAddAssociationMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}add${plur}!: Sequelize.HasManyAddAssociationsMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}create${sing}!: Sequelize.HasManyCreateAssociationMixin<${hasModel}>;\n`;
            str += `${sp}remove${sing}!: Sequelize.HasManyRemoveAssociationMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}remove${plur}!: Sequelize.HasManyRemoveAssociationsMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}has${sing}!: Sequelize.HasManyHasAssociationMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}has${plur}!: Sequelize.HasManyHasAssociationsMixin<${hasModel}, ${hasModel}Id>;\n`;
            str += `${sp}count${plur}!: Sequelize.HasManyCountAssociationsMixin;\n`;
            needed[rel.childTable].add(hasModel);
            needed[rel.childTable].add(`${hasModel}Id`);
          }
        }
      } else {
        // rel.isM2M
        if (rel.parentTable === table) {
          // many-to-many
          const isParent = rel.parentTable === table;
          const thisModel = isParent ? rel.parentModel : rel.childModel;
          const otherModel = isParent ? rel.childModel : rel.parentModel;
          const otherModelSingular = _.upperFirst(
            singularize(isParent ? rel.childProp : rel.parentProp),
          );
          const lotherModelPlural = pluralize(
            isParent ? rel.childProp : rel.parentProp,
          );
          const otherModelPlural = _.upperFirst(lotherModelPlural);
          const otherTable = isParent ? rel.childTable : rel.parentTable;
          str += `${sp}// ${thisModel} belongsToMany ${otherModel} via ${rel.parentId} and ${rel.childId}\n`;
          str += `${sp}${lotherModelPlural}!: ${otherModel}[];\n`;
          str += `${sp}get${otherModelPlural}!: Sequelize.BelongsToManyGetAssociationsMixin<${otherModel}>;\n`;
          str += `${sp}set${otherModelPlural}!: Sequelize.BelongsToManySetAssociationsMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}add${otherModelSingular}!: Sequelize.BelongsToManyAddAssociationMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}add${otherModelPlural}!: Sequelize.BelongsToManyAddAssociationsMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}create${otherModelSingular}!: Sequelize.BelongsToManyCreateAssociationMixin<${otherModel}>;\n`;
          str += `${sp}remove${otherModelSingular}!: Sequelize.BelongsToManyRemoveAssociationMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}remove${otherModelPlural}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}has${otherModelSingular}!: Sequelize.BelongsToManyHasAssociationMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}has${otherModelPlural}!: Sequelize.BelongsToManyHasAssociationsMixin<${otherModel}, ${otherModel}Id>;\n`;
          str += `${sp}count${otherModelPlural}!: Sequelize.BelongsToManyCountAssociationsMixin;\n`;
          needed[otherTable] ??= new Set();
          needed[otherTable].add(otherModel);
          needed[otherTable].add(`${otherModel}Id`);
        }
      }
    });
    if (needed[table]) {
      delete needed[table]; // don't add import for self
    }
    return { needed, str };
  }

  private addTypeScriptFields(table: string, isInterface: boolean) {
    const sp = this.space[1];
    const fields = _.keys(this.tables[table]);
    const notNull = isInterface ? '' : '!';
    let str = '';
    fields.forEach((field) => {
      if (
        !this.options.skipFields ||
        !this.options.skipFields.includes(field)
      ) {
        const name = this.quoteName(recase(this.options.caseProp, field));
        const isOptional = this.getTypeScriptFieldOptional(table, field);
        str += `${sp}${name}${
          isOptional ? '?' : notNull
        }: ${this.getTypeScriptType(table, field)};\n`;
      }
    });
    return str;
  }

  private getTypeScriptFieldOptional(table: string, field: string) {
    const fieldObj = this.tables[table][field];
    return fieldObj.allowNull;
  }

  private getTypeScriptType(table: string, field: string) {
    const fieldObj = this.tables[table][field] as TSField;
    return this.getTypeScriptFieldType(fieldObj, 'type');
  }

  private getTypeScriptFieldType(fieldObj: TSField, attr: keyof TSField) {
    const rawFieldType = fieldObj[attr] || '';
    const fieldType = String(rawFieldType).toLowerCase();

    let jsType: string;

    if (this.isArray(fieldType)) {
      const eltype = this.getTypeScriptFieldType(fieldObj, 'elementType');
      jsType = eltype + '[]';
    } else if (this.isNumber(fieldType)) {
      jsType = 'number';
    } else if (this.isBoolean(fieldType)) {
      jsType = 'boolean';
    } else if (this.isDate(fieldType)) {
      jsType = 'Date';
    } else if (this.isString(fieldType)) {
      jsType = 'string';
    } else if (this.isEnum(fieldType)) {
      const values = this.getEnumValues(fieldObj);
      jsType = values.join(' | ');
    } else if (this.isJSON(fieldType)) {
      jsType = 'object';
    } else {
      console.log(`Missing TypeScript type: ${fieldType || fieldObj['type']}`);
      jsType = 'any';
    }
    return jsType;
  }

  private getEnumValues(fieldObj: TSField): string[] {
    if (fieldObj.special) {
      // postgres
      return fieldObj.special.map((v) => `"${v}"`);
    } else {
      // mysql
      return fieldObj.type.substring(5, fieldObj.type.length - 1).split(',');
    }
  }

  private isTimestampField(field: string) {
    const additional = this.options.additional;
    if (additional.timestamps === false) {
      return false;
    }
    return (
      (!additional.createdAt && recase('c', field) === 'createdAt') ||
      additional.createdAt === field ||
      (!additional.updatedAt && recase('c', field) === 'updatedAt') ||
      additional.updatedAt === field
    );
  }

  private isParanoidField(field: string) {
    const additional = this.options.additional;
    if (additional.timestamps === false || additional.paranoid === false) {
      return false;
    }
    return (
      (!additional.deletedAt && recase('c', field) === 'deletedAt') ||
      additional.deletedAt === field
    );
  }

  private isIgnoredField(field: string) {
    return this.options.skipFields && this.options.skipFields.includes(field);
  }

  private escapeSpecial(val: string) {
    if (typeof val !== 'string') {
      return val;
    }
    return val
      .replace(/[\\]/g, '\\\\')
      .replace(/[\"]/g, '\\"')
      .replace(/[\/]/g, '\\/')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
  }

  /** Quote the name if it is not a valid identifier */
  private quoteName(name: string) {
    return /^[$A-Z_][0-9A-Z_$]*$/i.test(name) ? name : "'" + name + "'";
  }

  private isNumber(fieldType: string): boolean {
    return /^(smallint|mediumint|tinyint|int|bigint|float|money|smallmoney|double|decimal|numeric|real|oid)/.test(
      fieldType,
    );
  }

  private isBoolean(fieldType: string): boolean {
    return /^(boolean|bit)/.test(fieldType);
  }

  private isDate(fieldType: string): boolean {
    return /^(datetime|timestamp)/.test(fieldType);
  }

  private isString(fieldType: string): boolean {
    return /^(char|nchar|string|varying|varchar|nvarchar|text|longtext|mediumtext|tinytext|ntext|uuid|uniqueidentifier|date|time|inet|cidr|macaddr)/.test(
      fieldType,
    );
  }

  private isArray(fieldType: string): boolean {
    return /(^array)|(range$)/.test(fieldType);
  }

  private isEnum(fieldType: string): boolean {
    return /^(enum)/.test(fieldType);
  }

  private isJSON(fieldType: string): boolean {
    return /^(json|jsonb)/.test(fieldType);
  }
}

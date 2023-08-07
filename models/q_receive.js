const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('q_receive', {
    tenant: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      comment: "租户编码"
    },
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "组织机构主键",
      field: 'org_id'
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    orgName: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "组织机构名称",
      field: 'org_name'
    },
    orderDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "单据日期",
      field: 'order_date'
    },
    orderCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "单据编号",
      field: 'order_code'
    },
    orderOrigin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "单据来源 或者0代表磅单1代表pda",
      field: 'order_origin'
    },
    serviceType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "业务类型 或者0代表调入 1代表收料",
      field: 'service_type'
    },
    orderType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "类型默认值（0）1冲红2补录3退料4普通",
      field: 'order_type'
    },
    maker: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "制单人"
    },
    makerDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "制单日期",
      field: 'maker_date'
    },
    remark: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "主表备注"
    },
    printTimes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "打印次数",
      field: 'print_times'
    },
    plateNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "车牌号",
      field: 'plate_number'
    },
    supplierId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "供应商id",
      field: 'supplier_id'
    },
    supplierName: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "供应商名称",
      field: 'supplier_name'
    },
    exitTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "出场时间",
      field: 'exit_time'
    },
    isRed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: "是否冲红（0）",
      field: 'is_red'
    },
    isAudit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: "审核（默认为0）",
      field: 'is_audit'
    },
    auditor: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "审核人"
    },
    auditDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "审核时间",
      field: 'audit_date'
    },
    oriOrgId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "对接组织机构",
      field: 'ori_org_id'
    },
    oriSupplierId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "预留对接主键字段【常用供应商】",
      field: 'ori_supplier_id'
    },
    oriOrderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "上传之前的磅单主键",
      field: 'ori_order_id'
    },
    creatorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "添加人主键",
      field: 'creator_id'
    },
    creatorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'creator_name'
    },
    modifierId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'modifier_id'
    },
    modifierName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'modifier_name'
    },
    orderBarCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'order_bar_code'
    },
    longitude: {
      type: DataTypes.DECIMAL(18,6),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(18,6),
      allowNull: true
    },
    recordedDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'recorded_date'
    },
    orderDataId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'order_data_id'
    },
    sortOrderCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sort_order_code'
    },
    rdsId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      field: 'rds_id'
    },
    isRds: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      field: 'is_rds'
    },
    purchaseMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'purchase_method'
    },
    purchaseMethodFullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "采购方式全称",
      field: 'purchase_method_full_name'
    },
    version: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isRemoved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_removed'
    },
    insertFrom: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "区分对接数据",
      field: 'insert_from'
    },
    originalOrderId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "原单据Id",
      field: 'original_order_id'
    },
    originalOrderCode: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "原单据编号",
      field: 'original_order_code'
    },
    contractId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "合同id",
      field: 'contract_id'
    },
    contractCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "合同编号",
      field: 'contract_code'
    },
    settlementId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "结算单位Id",
      field: 'settlement_id'
    },
    settlementName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "结算单位名称",
      field: 'settlement_name'
    },
    freight: {
      type: DataTypes.DECIMAL(28,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "运费"
    },
    isVoid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "是否作废",
      field: 'is_void'
    },
    isProduction: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "是否生产组织发料生成",
      field: 'is_production'
    },
    receiveType: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "单据类型",
      field: 'receive_type'
    },
    receiveOriOrderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      comment: "直收直发分解后收料oriOrderId",
      field: 'receive_ori_order_id'
    },
    taxRate: {
      type: DataTypes.DECIMAL(28,4),
      allowNull: true,
      comment: "税率",
      field: 'tax_rate'
    },
    priceType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "价格类型",
      field: 'price_type'
    }
  }, {
    tableName: 'q_receive',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tenant" },
          { name: "org_id" },
          { name: "id" },
        ]
      },
    ]
  });
};

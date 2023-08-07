const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('q_delivery', {
    tenant: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      comment: "租户编码"
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "组织机构主键",
      field: 'org_id'
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
      type: DataTypes.STRING(225),
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
      type: DataTypes.STRING(50),
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
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "车牌号",
      field: 'plate_number'
    },
    labourId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用料单位编号",
      field: 'labour_id'
    },
    labourName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用料单位名称",
      field: 'labour_name'
    },
    ghId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "工号主键",
      field: 'gh_id'
    },
    ghFullId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "工号主键链",
      field: 'gh_full_id'
    },
    ghFullName: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "工号全称",
      field: 'gh_full_name'
    },
    ghName: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "工号名称",
      field: 'gh_name'
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
    oriLabourId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "【常用用料单位】预留",
      field: 'ori_labour_id'
    },
    oriGhId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "【工号】预留",
      field: 'ori_gh_id'
    },
    oriOrderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'ori_order_id'
    },
    creatorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'creator_id'
    },
    creatorName: {
      type: DataTypes.STRING(50),
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
    allotId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'allot_id'
    },
    orderDataId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'order_data_id'
    },
    materialType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'material_type'
    },
    sortOrderCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sort_order_code'
    },
    deliveryType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'delivery_type'
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
      comment: "是否是直进直出",
      field: 'is_rds'
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
    concretePlanId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "混凝土计划通知单id",
      field: 'concrete_plan_id'
    },
    concretePlanCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "混凝土计划通知单编号",
      field: 'concrete_plan_code'
    },
    isToProduction: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "是否为生产组织发料单",
      field: 'is_to_production'
    },
    insertFrom: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "区分对接数据",
      field: 'insert_from'
    },
    deliveryQuantity: {
      type: DataTypes.DECIMAL(28,4),
      allowNull: true,
      defaultValue: 0.0000,
      comment: "发料总量(四局混凝土发料单用)",
      field: 'delivery_quantity'
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
    gqId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "工区id",
      field: 'gq_id'
    },
    gqName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "工区名称",
      field: 'gq_name'
    },
    isVoid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "是否作废",
      field: 'is_void'
    },
    scrapReason: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "报废原因",
      field: 'scrap_reason'
    },
    methodHandle: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "废材处理方式",
      field: 'method_handle'
    },
    teamLeader: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "队长姓名",
      field: 'team_leader'
    },
    teamId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "队伍id",
      field: 'team_id'
    },
    teamName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "队伍名称",
      field: 'team_name'
    },
    deductType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "代扣款类型 0不扣款 1  代购扣款",
      field: 'deduct_type'
    },
    receiveOriOrderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "直收直发分解后收料oriOrderId",
      field: 'receive_ori_order_id'
    },
    affirm: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "半成品过磅复称标记"
    },
    oriSemiId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "原过磅复称orderId",
      field: 'ori_semi_id'
    },
    recoveryName: {
      type: DataTypes.STRING(521),
      allowNull: true,
      defaultValue: "",
      comment: "回收单位名称",
      field: 'recovery_name'
    },
    secondaryNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "二次发料次数",
      field: 'secondary_num'
    }
  }, {
    tableName: 'q_delivery',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tenant" },
          { name: "id" },
          { name: "org_id" },
        ]
      },
    ]
  });
};

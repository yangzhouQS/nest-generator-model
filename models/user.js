const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "用户主键"
    },
    userName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "用户姓名",
      field: 'user_name'
    },
    userPhone: {
      type: DataTypes.STRING(125),
      allowNull: true,
      comment: "登录手机号",
      field: 'user_phone'
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "用户登录密码"
    },
    quantity: {
      type: DataTypes.DECIMAL(28,4),
      allowNull: true,
      comment: "数量"
    },
    isRemoved: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "删除标识",
      field: 'is_removed'
    }
  }, {
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

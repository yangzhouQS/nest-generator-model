var DataTypes = require('sequelize').DataTypes;
var _q_delivery = require('./q_delivery');
var _q_receive = require('./q_receive');
var _user = require('./user');

function initModels(sequelize) {
  var q_delivery = _q_delivery(sequelize, DataTypes);
  var q_receive = _q_receive(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  return {
    q_delivery,
    q_receive,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

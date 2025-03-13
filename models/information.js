'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Information.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    adminId: DataTypes.INTEGER,
    status: DataTypes.TINYINT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Information',
  });
  return Information;
};
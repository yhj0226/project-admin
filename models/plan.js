'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Plan.belongsTo(models.Student,{as:'student'})
    }
  }
  Plan.init({
    studentId: DataTypes.INTEGER,
    goal: DataTypes.TEXT,
    interests: DataTypes.TEXT,
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Plan',
  });
  return Plan;
};
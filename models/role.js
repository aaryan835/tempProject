'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({
    id : {
      allowNull : false,
      autoIncrement : true,
      primaryKey : true,
      type : DataTypes.BIGINT
    },
    name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    code: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    is_public : {
      type : DataTypes.BOOLEAN,
      allowNull : false
    },
    description : {
      type : DataTypes.TEXT('long'),
      allowNull : false
    },
    ordering : {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Role',
    timestamps : true,
    underscored : true
  });
  return Role;
};
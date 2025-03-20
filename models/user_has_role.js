'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User_has_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_has_role.belongsTo(models.User,{
        foreignKey : 'user_id',
        as : 'user'
      })
      
    }
  }
  User_has_role.init({
    id : {
      allowNull : false,
      autoIncrement : true,
      primaryKey : true,
      type : DataTypes.BIGINT
    },
    user_id : {
      type : DataTypes.BIGINT,
      allowNull : false
    },
    role_id: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    deleted_at : {
      type : DataTypes.DATE,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'User_has_role',
    timestamps : true,
    underscored : true
  });
  return User_has_role;
};
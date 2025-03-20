'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.User_has_role,{
        foreignKey : 'user_id',
        as : 'role'
      })
    }
  }
  User.init({
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true, 
      allowNull : false,
      autoIncrement : true
    },
    first_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    last_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    full_name : {
      type : DataTypes.STRING,
      allowNull : false
    },
    user_name : {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    password : {
      type : DataTypes.STRING,
      allowNull : false
    },
    is_active : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : true
    },
    remember_me : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps : true
  });
  return User;
};
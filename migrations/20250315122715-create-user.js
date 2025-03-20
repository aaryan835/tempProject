'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull : false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull : false
      },
      email: {
        type: Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      full_name : {
        type : Sequelize.STRING,
        allowNull : false
      },
      user_name : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      password : {
        type : Sequelize.STRING,
        allowNull : false
      },
      is_active : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
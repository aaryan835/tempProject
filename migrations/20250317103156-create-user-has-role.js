'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_has_roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id : {
        type : Sequelize.BIGINT,
        references : {
          model : {
            tableName : 'users'
          },
          key : 'id'
        },
        allowNull : false
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      deleted_at : {
        type : Sequelize.DATE,
        allowNull : false
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
    await queryInterface.dropTable('User_has_roles');
  }
};
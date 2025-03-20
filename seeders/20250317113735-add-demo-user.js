'use strict';
const bcrypt = require('bcrypt')
const SALT_ROUUNDS = require('../utils/constant')
async function genhashPass(pass)  {
  let hashPass = await bcrypt.hash(pass,parseInt(SALT_ROUUNDS))
  return hashPass
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
    let hashPass = await bcrypt.hash('admin@1234',parseInt(SALT_ROUUNDS))
    await queryInterface.bulkInsert('Users',[{
      first_name : 'first',
      last_name : 'admin',
      email : 'admin@gmail.com',
      full_name : `first admin`,
      user_name : `first_admin`,
      password : await genhashPass('admin@1234'),
      createdAt : new Date,
      updatedAt : new Date
    },{
      first_name : 'second',
      last_name : 'admin',
      email : 'secondadmin@gmail.com',
      full_name : `second admin`,
      user_name : `second_admin`,
      password : await genhashPass('secondadmin@1234'),
      createdAt : new Date,
      updatedAt : new Date
    },{
      first_name : 'first',
      last_name : 'user',
      email : 'user@gmail.com',
      full_name : `first user`,
      user_name : `first_user`,
      password : await genhashPass('user@1234'),
      createdAt : new Date,
      updatedAt : new Date
    },{
      first_name : 'second',
      last_name : 'user',
      email : 'seconduser@gmail.com',
      full_name : `second user`,
      user_name : `second_user`,
      password : await genhashPass('seconduser@1234'),
      createdAt : new Date,
      updatedAt : new Date
    }],{})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users',null,{})
  }
};

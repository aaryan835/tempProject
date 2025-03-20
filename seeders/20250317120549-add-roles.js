'use strict';

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
   await queryInterface.bulkInsert('Roles',[{
    name : 'Admin',
    code : 'admin',
    is_public : false,
    description : 'Admin with full system access',
    ordering : 1,
    createdAt : new Date,
    updatedAt : new Date
   },
   {
    name: 'User',
    code: 'user',
    is_public: true,
    description: 'Regular user with limited permissions.',
    ordering: 3,
    createdAt: new Date(),
    updatedAt: new Date()
   },
  {
    name: 'Moderator',
    code: 'moderator',
    is_public: false,
    description: 'Moderator with permission to manage user content.',
    ordering: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Guest',
    code: 'guest',
    is_public: true,
    description: 'Guest user with minimal access.',
    ordering: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles',null,{})
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Floors', [{
                floorNumber: 1,
                percentCapacity: 0.75, // 75% capacity
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                floorNumber: 2,
                percentCapacity: 0.60, // 60% capacity
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                floorNumber: 3,
                percentCapacity: 0.40, // 40% capacity
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                floorNumber: 4,
                percentCapacity: 0.90, // 90% capacity
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                floorNumber: 5,
                percentCapacity: 0.20, // 20% capacity
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Floors', null, {});
    }
};
// seeders/xxxxxx-seedLibraryStats.js
'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Insert initial data into the LibraryStat table
        return queryInterface.bulkInsert('LibraryStats', [{
                FloorID: 2,
                busyScale: 5,
                createdAt: new Date(),
            },
            {
                FloorID: 3,
                busyScale: 4,
                createdAt: new Date(),
            },
            {
                FloorID: 1,
                busyScale: 5,
                createdAt: new Date(),
            },
        ], {});
    },

    down: async(queryInterface, Sequelize) => {
        // Remove all data from the LibraryStat table
        return queryInterface.bulkDelete('LibraryStats', null, {});
    }
};
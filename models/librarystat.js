'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LibraryStat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    LibraryStat.init({
        floorID: DataTypes.INTEGER,
        busyScale: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'LibraryStat',
    });
    return LibraryStat;
};
'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserStocks = sequelize.define('userstocks', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    },
    stock_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'stocks',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    paranoid: true,
    underscored: true
  });
  return UserStocks;
}
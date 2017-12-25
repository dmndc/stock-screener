'use strict'

module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('stock', {
    symbol: { type: DataTypes.STRING, primaryKey: false, unique: true },
    companyName: { type: DataTypes.STRING, field: 'company' },
    sector: { type: DataTypes.STRING },
    change: { type: DataTypes.DECIMAL },
    changePercent: { type: DataTypes.DECIMAL, field: 'change_percent' },
    open: { type: DataTypes.DECIMAL },
    close: { type: DataTypes.DECIMAL },
    latestPrice: { type: DataTypes.DECIMAL, field: 'latest_price' },
    latestVolume: { type: DataTypes.INTEGER, field: 'latest_volume' },
    marketCap: { type: DataTypes.BIGINT, field: 'marketcap' },
    peRatio: { type: DataTypes.DECIMAL, field: 'pe_ratio' },
    week52High: { type: DataTypes.DECIMAL, field: 'week52high' },
    week52Low: { type: DataTypes.DECIMAL, field: 'week52low' },
    ytdChange: { type: DataTypes.DECIMAL, field: 'ytdchange' }
  }, {
    paranoid: true,
    underscored: true
  }); 
  return Stock;
};




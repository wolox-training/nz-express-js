module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define('weet', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Weet.associate = ({ user, rating }) => {
    Weet.hasMany(rating);
    Weet.belongsTo(user, { foreignKey: 'userId' });
  };

  return Weet;
};

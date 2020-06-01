module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define('weet', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Weet.associate = ({ User }) => {
    Weet.belongsTo(User);
  };
  return Weet;
};

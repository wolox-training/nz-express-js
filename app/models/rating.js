module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'rating',
    {
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { timestamps: true }
  );

  Rating.associate = ({ weet, user }) => {
    Rating.belongsTo(weet, { foreignKey: 'weetId' });
    Rating.belongsTo(user, { foreignKey: 'ratingUserId' });
  };

  return Rating;
};

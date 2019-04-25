'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Collaborator.associate = function(models) {
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
  };
  return Collaborator;
};
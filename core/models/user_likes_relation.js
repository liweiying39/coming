'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserLikesRelation = sequelize.define('UserLikesRelation', {
    // target_user_id: DataTypes.INTEGER,
    // from_user_id: DataTypes.INTEGER,
    // event_id: DataTypes.INTEGER
    target_user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'user_likes_relation'
    },
    from_user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'user_likes_relation'
    },
    event_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'user_likes_relation'
    },
  }, {
    tableName: 'user_likes_relations',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserLikesRelation;
};
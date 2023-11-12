"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserTodo extends Model {
    static associate(models) {
      UserTodo.belongsTo(models.User, { foreignKey: "user_id" });
      UserTodo.belongsTo(models.TodoList, { foreignKey: "list_id" });
    }
  }

  UserTodo.init(
    {
      user_id: DataTypes.INTEGER,
      list_id: DataTypes.INTEGER,
      access_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserTodo",
    }
  );
  
  return UserTodo;
};

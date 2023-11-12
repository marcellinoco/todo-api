"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TodoList extends Model {
    static associate(models) {
      TodoList.belongsTo(models.User, { foreignKey: "owner_id" });
      TodoList.hasMany(models.TodoItem, { foreignKey: "list_id", as: "items" });
      TodoList.hasMany(models.UserTodo, { foreignKey: "list_id" });
    }
  }

  TodoList.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TodoList",
    }
  );

  return TodoList;
};

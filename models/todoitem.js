"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TodoItem extends Model {
    static associate(models) {
      TodoItem.belongsTo(models.TodoList, { foreignKey: "list_id" });
    }
  }

  TodoItem.init(
    {
      content: DataTypes.STRING,
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      due_date: DataTypes.DATE,
      list_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TodoItem",
    }
  );

  return TodoItem;
};

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Material = sequelize.define("Material", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  filePath: { type: DataTypes.STRING, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  result: { type: DataTypes.TEXT }, // Optional: store GPT results
  type: { type: DataTypes.ENUM("summary", "flashcards", "quiz") }
});

module.exports = Material;

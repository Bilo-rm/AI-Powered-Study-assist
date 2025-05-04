const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require("./userModel");

const ResponseHistory = sequelize.define("ResponseHistory", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.UUID, 
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  action: { 
    type: DataTypes.ENUM("summary", "flashcards", "quiz"), 
    allowNull: false 
  },
  prompt: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  response: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  originalContent: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  fileName: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
});

// Create association with User model
ResponseHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ResponseHistory, { foreignKey: 'userId' });

module.exports = { ResponseHistory };
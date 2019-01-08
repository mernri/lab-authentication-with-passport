const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

// Mes users seront enregistrés dans ma base mongodb User 
const User = mongoose.model("User", userSchema);
module.exports = User;
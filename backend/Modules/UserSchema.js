const mongoose = require("mongoose");
const { type } = require("os");


const UserSchema = new mongoose.Schema({
    address: { type: String, unique: true },
    nonce: { type: Number, default: Math.floor(Math.random() * 10000) },
  }, {timestamps: true}
);
  
let User = mongoose.models.users || mongoose.model("User", UserSchema)


module.exports = {User};
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    shoppinglist: {
      type: Array,
      required: false,
    },
  });


module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
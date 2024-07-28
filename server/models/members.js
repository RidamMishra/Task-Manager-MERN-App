const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    uname: String,
    password: String,
    email: String,
    lead: Boolean
})

const memberModel = mongoose.model("members",memberSchema);

module.exports = memberModel;
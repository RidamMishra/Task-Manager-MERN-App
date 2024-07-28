const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    team:String,
    createdBy:String
})

const listModel = mongoose.model("teams",listSchema);

module.exports = listModel;
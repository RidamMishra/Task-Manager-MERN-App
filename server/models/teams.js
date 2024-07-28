const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    member: String,
    email:String,
    assignment:String,
    lead:Boolean,
    complete:Boolean
})

module.exports = teamSchema;
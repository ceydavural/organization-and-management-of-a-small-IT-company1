const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoListSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    long: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true
    }
}, { timestamps: true });


const toDoList = mongoose.model('toDoList', toDoListSchema);


module.exports = toDoList;
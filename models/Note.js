const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({    
    title: {
        type : String,
        required : true
    },
    priority : {
        type : String,
        default : "Normal"
    },
    completed : {
        type : Boolean,
        default : false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps : true
})

const Note = mongoose.model('Note',noteSchema);
module.exports = Note;
const Note = require('../models/Note');  
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');


//for querying


const showAllNotes = asyncHandler(async (req,res) => {
    //for querying
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1)* limit;
    const query = {
        user : req.user.id
    };
    if(req.query.priority){
        query.priority = req.query.priority
    }
    //search query
    if(req.query.search){
        query.title= {
            $regex : req.query.search,
            $options : "i"
        }
    }

    //sorting architecture
    let sortingOptions = {}
    if(req.query.sort === "latest"){
        sortingOptions.createdAt = -1;
    }

    if(req.query.sort === "oldest"){
        sortingOptions.createdAt = 1;
    }

    const AllNotes = await Note.find(query)
    .populate("user","name email")
    .skip(skip)
    .limit(limit)
    .sort(sortingOptions)
 

    return res.status(200).json({
        notes : AllNotes,
    }) 
})


const addNewNote = asyncHandler(async (req,res) => {
    const newNote = await Note.create({
            title : req.body.title,
            priority : req.body.priority,
            user : req.user.id //this will set up the relationship and tell who created this note

        })
        return res.status(201).json({
            message : "Note added successfully",
            note: newNote
        })
})

const findNote = asyncHandler(async (req,res,next) => {
        const NoteId = req.params.id;
        const note = await Note.findOne({
            _id : NoteId,
            user : req.user.id
        })
        if(!note){
            const error = new Error("Note not found");
            error.status = 404;
            return next(error);
        }
        return res.json(note)
});


const updateNote = asyncHandler(async (req,res,next) => {
    const NoteId = req.params.id;
        const note = await Note.findOne({
            _id : NoteId,
            user : req.user.id
        })


        if(!note){
            const error = new Error("Note not found");
            error.status = 404;

            return next(error);
        }

        note.title = req.body.title || note.title
        note.priority = req.body.priority || note.priority
        await note.save()

        return res.status(200).json({
            message : "Note updated successfully",
            note : note
        })
})


const deleteNote = asyncHandler(async(req,res,next) => {
   const NoteId = req.params.id;
        const deletedNote = await Note.findOneAndDelete({
            _id : NoteId,
            user : req.user.id
        })

        if(!deletedNote){
            const error = new Error("Note not found");
            error.status = 404;
            return next(error);
        }
        return res.status(200).json({
            message : "Note deleted successfully"
        })
})

module.exports = {
    showAllNotes,
    addNewNote,
    findNote,
    updateNote,
    deleteNote
}
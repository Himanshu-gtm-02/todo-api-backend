const express = require('express');
const router = express.Router();
const notes = require('../data/notes');
const {body, query} = require('express-validator');

const {showAllNotes,findNote,addNewNote,updateNote,deleteNote} = require('../controllers/noteController');
const noteValidatorMiddleware = require('../middlewares/validationMiddleware')
const protect = require('../middlewares/authMidlleware')
const validate = require('../validators/authValidator')


//shows notes
router.get('/notes',query("limit")
.optional()
.isInt({min : 1})
.withMessage("Limit must be positive number.."),

query("page")
.optional()
.isInt({min : 1})
.withMessage("Enter valid page number in the query.."),


query("sort")
.optional()
.isIn(["latest", "oldest"])
.withMessage("Enter correct sort value.."),


query("priority")
.optional()
.isIn(["High", "Low" , "Medium"])
.withMessage("Please enter valid prirority"),


query("search")
.optional()
.isLength({max : 50})
.withMessage("search query is too large, keep it short"),


validate,
protect,showAllNotes)





//create new notes
router.post('/notes',   
    validate,

    protect,noteValidatorMiddleware, addNewNote);


//find note using id

router.get('/notes/:id',protect, findNote);


//update note
router.put('/notes/:id',protect,updateNote)

//delete note
router.delete('/notes/:id',protect,deleteNote)

module.exports = router;
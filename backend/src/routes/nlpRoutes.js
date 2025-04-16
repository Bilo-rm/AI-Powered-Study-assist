const express = require('express');
const router = express.Router();
const {summarizeText}= require('../controllers/summarizeController');
const {generateFlashcards}= require('../controllers/flashcardController');
const {generateQuestions}= require('../controllers/questionController');


router.post('/summarize', summarizeText);
router.post('/flashcards', generateFlashcards);
router.post('/questions', generateQuestions);

module.exports = router;

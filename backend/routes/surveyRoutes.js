const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.get('/', surveyController.getAllSurveys);
router.get('/:id', surveyController.getSurveyById);
router.post('/', surveyController.createSurvey);
router.post('/answers', surveyController.submitAnswers);
router.get('/user/:userId', surveyController.getSurveysByUser);
router.get('/:id/results', surveyController.getSurveyResults);
module.exports = router;

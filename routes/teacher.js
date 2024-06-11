const express = require('express');
const Class = require('../models/Class');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const csv = require('csvtojson');
const mongoose = require('mongoose');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/classes', authMiddleware, async (req, res) => {
  const { name, subject } = req.body;
  const teacherId = req.userId;

  try {
    const newClass = new Class({ name, subject, teacher: teacherId });
    await newClass.save();
    res.status(201).send(newClass);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post('/upload/:classId', authMiddleware, upload.single('file'), async (req, res) => {
  const classId = req.params.classId;
  const filePath = req.file.path;

  try {
    const questions = await csv().fromFile(filePath);
    const formattedQuestions = questions.map(q => ({
      classId: classId,
      text: q.question,
      options: [
        { text: q.option1, isCorrect: q.correctOption === '1' },
        { text: q.option2, isCorrect: q.correctOption === '2' },
        { text: q.option3, isCorrect: q.correctOption === '3' },
        { text: q.option4, isCorrect: q.correctOption === '4' }
      ]
    }));

    await Question.insertMany(formattedQuestions);
    res.status(201).send({ message: 'Questions uploaded successfully' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;

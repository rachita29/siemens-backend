const express = require('express');
const Question = require('../models/Question');
const Class = require('../models/Class');
const authMiddleware = require('../middleware/auth');
const pdf = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/take-exam/:classId', authMiddleware, async (req, res) => {
  const classId = req.params.classId;

  try {
    const questions = await Question.aggregate([
      { $match: { classId: mongoose.Types.ObjectId(classId) } },
      { $sample: { size: 100 } }
    ]);

    const studentAnswers = questions.map(q => ({
      question: q.text,
      options: q.options,
      studentAnswer: q.options[Math.floor(Math.random() * 4)],
      correctAnswer: q.options.find(opt => opt.isCorrect)
    }));

    res.status(200).send(studentAnswers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/classes/:name', authMiddleware, async (req, res) => {
    const className = req.params.name;
  
    try {
      const matchingClass = await Class.aggregate([
        { $match: { name: className } }
      ]);
  
      res.status(200).send(matchingClass);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

router.post('/generate-pdf', authMiddleware, async (req, res) => {
  const { examData } = req.body;
  const doc = new pdf();
  const filename = 'exam_result.pdf'

    doc.pipe(fs.createWriteStream(filename));

    examData.forEach((item, index) => {
        doc.fontSize(12).text(`Q${index + 1}: ${item.question}`, {underline: true});
        doc.moveDown(0.5);

        item.options.forEach(option => {
            doc.text(`- ${option.text}`);
        });

        doc.moveDown(0.5);
        doc.text(`Student's Answer: ${item.studentAnswer.text}`, {bold: true});
        doc.text(`Is Correct: ${item.studentAnswer.isCorrect ? 'Yes' : 'No'}`);
        doc.moveDown(1);
    });

    doc.end();
    res.status(200).send({ message: 'PDF generated successfully' });
});


module.exports = router;

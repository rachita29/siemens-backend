const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  text: { type: String, required: true },
  options: [{ text: String, isCorrect: Boolean }]
});

module.exports = mongoose.model('Question', questionSchema);

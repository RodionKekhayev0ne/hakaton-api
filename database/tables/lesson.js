const mongoose = require('mongoose');

// Определение схемы для пользователя
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true},
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null,
  },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: [],
    }]
});

// Создание модели на основе схемы
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;

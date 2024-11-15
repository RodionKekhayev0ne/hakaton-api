const mongoose = require('mongoose');

// Определение схемы для пользователя
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  lessons : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: [],
  }],
});

// Создание модели на основе схемы
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

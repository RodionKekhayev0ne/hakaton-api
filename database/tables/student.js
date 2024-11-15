const mongoose = require('mongoose');

// Определение схемы для пользователя
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String},
  password: { type: String, required: true},
  phoneNumber: { type: String, required: true,unique: true },
  parentPhoneNumber: { type: String, required: true},
  lessons : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: []
  }],
  absencePerMonth: { type: Number, default: 0, max: 31, defaultValue: 0},
  visitRate: {
    type: Number,
    set: v => parseFloat(v.toFixed(2)),
    max: 10, min: 0, default: 10}
});

// Создание модели на основе схемы
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

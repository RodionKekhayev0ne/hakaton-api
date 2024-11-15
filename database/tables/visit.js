const mongoose = require('mongoose');

// Определение схемы для пользователя
const visitSchema = new mongoose.Schema({
  date: {type: Date, required: true },
  teacher:  {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
default: null,
},
  lesson : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  students : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: [],
  }],
});

// Создание модели на основе схемы
const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;

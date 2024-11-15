const mongoose = require('mongoose');

// Определение схемы для пользователя
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Создание модели на основе схемы
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

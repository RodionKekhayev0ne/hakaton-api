// routes.js
const express = require('express');
const student = express.Router();

// Пример маршрута для главной страницы
student.post('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Пример маршрута для страницы профиля
student.get('/profile', (req, res) => {
  res.send('This is the Profile Page!');
});

// Экспорт маршрутизатора
module.exports = student;

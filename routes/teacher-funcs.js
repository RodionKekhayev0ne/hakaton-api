// routes.js
const express = require('express');
const teacher = express.Router();

// Пример маршрута для главной страницы
teacher.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Пример маршрута для страницы профиля
teacher.get('/profile', (req, res) => {
  res.send('This is the Profile Page!');
});

// Экспорт маршрутизатора
module.exports = teacher;

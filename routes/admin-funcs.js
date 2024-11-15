// routes.js
const express = require('express');
const Visit = require("../database/tables/visit");
const admin = express.Router();
const Lesson = require('../database/tables/lesson')
const Teacher = require('../database/tables/teacher')
// Пример маршрута для главной страницы
admin.post('/createLesson', async (req, res) => {
  const {lesson_title, phone_number} = req.body;
  try {
    const teacher = await Teacher.findOne({phoneNumber: phone_number});

    if (!teacher) {
      throw new Error('Учитель с указанным номером телефона не найден');
    }

    const newLesson = new Lesson({
      title: lesson_title,
      teacher: teacher._id,
    })
    await newLesson.save()
    res.send('Lesson ' + lesson_title + ' created');
  } catch (error) {
    console.log(error)
    res.status(400).send('something wrong');
  }


});

// Пример маршрута для страницы профиля
admin.post('/', (req, res) => {
  res.send('This is the Profile Page!');
});

// Экспорт маршрутизатора
module.exports = admin;

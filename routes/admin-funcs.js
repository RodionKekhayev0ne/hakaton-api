// routes.js
const express = require('express');
const Visit = require("../database/tables/visit");
const admin = express.Router();
const Lesson = require('../database/tables/lesson')
const Teacher = require('../database/tables/teacher')
const Student = require('../database/tables/student')
// Пример маршрута для главной страницы
admin.post('/createLesson', async (req, res) => {
  const {lesson_title, phone_number} = req.body;
  try {
    const teacher = await Teacher.findOne({
      phoneNumber: phone_number
    });

    if (!teacher) {
      throw new Error('Учитель с указанным номером телефона не найден');
    }

    const newLesson = new Lesson({
      title: lesson_title,
      teacher: teacher._id,
    })
    await newLesson.save();
    teacher.lessons.push(newLesson._id);
    console.log(teacher.lessons)
    await teacher.save();
    res.send('Lesson ' + lesson_title + ' created');
  } catch (error) {
    console.log(error)
    res.status(400).send('something wrong');
  }

});

admin.get('/lessons', async (req, res) => {
  const token = req.cookies.userToken;
  if (true) {
    const lessonsFromDb = await Lesson.find({}).populate('teacher')  // Подгрузить данные учителя по его ID
      .populate('students');
    return res.status(201).json({lessons: lessonsFromDb});
  }
  res.status(403).send('accuses denied');
});

admin.get('/lessonsWithoutTeacher', async (req, res) => {
  const token = req.cookies.userToken;
  if (true) {
    const lessonsWithoutTeacher = await Lesson.find({ teacher: null }).populate('students');
    return res.status(201).json({ lessons: lessonsWithoutTeacher });
  }
  res.status(403).send('Access denied');
});
admin.get('/students', async (req, res) => {
  const token = req.cookies.userToken;
  console.log(token)
  if (true) {
    const lessonsFromDb = await Student.find({}).populate('lessons')  // Подгрузить данные учителя по его ID
    return res.status(201).json({students: lessonsFromDb});
  }
  res.status(403).send('accuses denied');
});
admin.get('/teachers', async (req, res) => {
  const token = req.cookies.userToken;
  if (true) {
    const lessonsFromDb = await Teacher.find({}).populate('lessons');
    return res.status(201).json({teachers: lessonsFromDb});
  }
  res.status(403).send('accuses denied');
});
// Пример маршрута для страницы профиля
admin.post('/', (req, res) => {
  res.send('This is the Profile Page!');
});

admin.post('/visits', async (req, res) => {
  const token = req.cookies.userToken;
  const {lessonId} = req.body;

  console.log(lessonId)
  if (true) {
    const lessonsFromDb = await Visit.find({ lesson: lessonId }) // Передаем только сам ID урока как строку
      .populate('teacher')  // Если нужно подгрузить данные учителя
      .populate('students')
      .populate('lesson');
    return res.status(201).json({visits: lessonsFromDb});
  }
  res.status(403).send('accuses denied');
});
// Пример маршрута для страницы профиля
admin.post('/', (req, res) => {
  res.send('This is the Profile Page!');
});

// Экспорт маршрутизатора
module.exports = admin;

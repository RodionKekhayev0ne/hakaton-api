// routes.js
const express = require('express');
const visit = express.Router();
const Visit = require('../database/tables/visit');
const Teacher = require("../database/tables/teacher");
const Lesson = require("../database/tables/lesson");
// Пример маршрута для главной страницы
visit.post('/addStudent', async (req, res) => {
  const {visitId, studentId} = req.body;
  try {
    const updatedVisit = await Visit.findByIdAndUpdate(
      visitId,
      {$push: {students: studentId}},
      {new: true} // Опция возвращает обновленный документ
    );
    if (!updatedVisit) {
      console.log('Запись не найдена');
    } else {
      console.log('Студент успешно добавлен:', updatedVisit);
    }
  } catch (error) {

  }

  res.send('Welcome to the Home Page!');
});

// Пример маршрута для страницы профиля
visit.post('/', (req, res) => {
  const {date} = req.body;
  try {
    let curentVisit = new Visit({
      });

  }catch (error){

  }
  res.send('This is the Profile Page!');
});


visit.post('/createVisit', async (req, res) => {
  const dateQuery = req.query.date;
  const {phone_number, lesson_title} = req.body;

  try {
    const teacher_id = await getTeacherId(phone_number)
    const lesson_id = await getLessonId(lesson_title)

    console.log(teacher_id + ' - ' + lesson_id)

    const newVisit = new Visit({
      date: dateQuery,
      teacher: teacher_id,
      lesson: lesson_id,
    })
    await newVisit.save()
    res.send('Visit ' + dateQuery + ' created');
  }catch (error){
    res.status(400).send('something wrong')
  }
});

async function getTeacherId(phone_number) {
  const teacher = await Teacher.findOne({phoneNumber: phone_number});

  if (!teacher) {
    throw new Error('Учитель с указанным номером телефона не найден');
  }
  return teacher._id
}

async function getLessonId(title) {
  const lesson = await Lesson.findOne({title: title});

  if (!lesson) {
    throw new Error('Учитель с указанным номером телефона не найден');
  }
  return lesson._id
}
// Экспорт маршрутизатора
module.exports = visit;

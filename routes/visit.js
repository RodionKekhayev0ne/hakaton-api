// routes.js
const express = require('express');
const visit = express.Router();
const Visit = require('../database/tables/visit');
const Teacher = require("../database/tables/teacher");
const Lesson = require("../database/tables/lesson");
const Student = require("../database/tables/student");


function getFormattedDate() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const now = new Date();

  const year = now.getFullYear();
  const monthName = months[now.getMonth()]; // Получаем название месяца
  const day = String(now.getDate()).padStart(2, '0'); // Делаем день двухзначным
  const hours = String(now.getHours()).padStart(2, '0'); // Делаем часы двухзначными
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Делаем минуты двухзначными

  return `${year} ${monthName} ${day} ${hours}:${minutes}`;
}

// Пример маршрута для главной страницы
visit.post('/addStudent', async (req, res) => {
  const {visitId, studentId} = req.body;
  try {
    const visit = await Visit.findById(visitId)
    const lesson = await Lesson.findById(visit.lesson);
    const student = await Student.findById(studentId);
    if (!lesson) {
      throw new Error('Урок не найден');
    }
    // Проверить, есть ли уже студент в списке студентов
    if (lesson.students.includes(studentId)) {
      console.log('Студент уже в списке');
    }else {
      lesson.students.push(studentId);
      await lesson.save();
    }
    if (student.lessons.includes(visit.lesson)) {
      console.log('Студент уже в списке');
    }else {
      student.lessons.push(visit.lesson);
      await student.save();
    }

   if (visit.students.includes(studentId)) {
      console.log('Студент уже в списке');
    }else {
     visit.students.push(studentId);
      await visit.save();
    }
    res.send('Student '+ student.name +' added to ' + visit.dateForCrm + " visit for lesson " + lesson.title);
  } catch (error) {

  }


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

  const {phone_number, lesson_title} = req.body;

  try {
    const teacher_id = await getTeacherId(phone_number)
    const lesson_id = await getLessonId(lesson_title)

    console.log(teacher_id + ' - ' + lesson_id)

    const newVisit = new Visit({
      date: getFormattedDate(),
      dateForCrm: getFormattedDate(),
      teacher: teacher_id,
      lesson: lesson_id,
    })
    await newVisit.save()
    res.status(200).json({visitId: newVisit._id, lesson: lesson_title});
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

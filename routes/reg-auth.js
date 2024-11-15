// routes.js
const express = require('express');
const regauth = express.Router();
const Student = require('../database/tables/student');
const Teacher = require('../database/tables/teacher');
const Admin = require('../database/tables/admin');
const bcrypt = require('bcrypt');

regauth.use(express.json());
regauth.use(express.urlencoded({ extended: true }));


regauth.post('/student', async (req, res) => {
  const { name, lastname, pass, phone, parent_phone, email } = req.body;
  const resMess = 'Student - ' + lastname + " " + name + ' created.';

  try {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const student = new Student({
      name: name,
      lastName: lastname,
      password: hashedPassword,
      phoneNumber: phone,
      parentPhoneNumber: parent_phone,
      email: email,
    });

    // Сохраняем студента и ожидаем результат
    await student.save();

    // Если сохранение прошло успешно, отправляем ответ с кодом 201
    return res.status(201).send(resMess);

  } catch (error) {
    console.error('Произошла ошибка:', error);

    // В случае ошибки отправляем ответ с кодом 400 и сообщением об ошибке
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});
regauth.get('/student', (req, res) => {
  res.send('This is the Profile Page!');
});


regauth.post('/teacher', async (req, res) => {
  const { name, lastName, email, pass, phoneNumber} = req.body;
  const resMess = `Teacher - ${lastName} ${name} created.`;

  try {
    // Проверка, существует ли уже преподаватель с таким email
    const existingTeacher = await Teacher.findOne({ email: email });
    if (existingTeacher) {
      return res.status(400).send('Teacher with this email already exists.');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Создание нового преподавателя
    const newTeacher = new Teacher({
      name: name,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
    });

    // Сохранение нового преподавателя в базе данных
    await newTeacher.save();

    // Отправка успешного ответа
    return res.status(201).send(resMess);

  } catch (error) {
    console.error('Произошла ошибка:', error);
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});
regauth.get('/teacher', (req, res) => {
  res.send('This is the Profile Page!');
});


regauth.post('/admin', async (req, res) => {
  const { name, email, pass } = req.body;
  const resMess = `Admin - ${name} created.`;

  try {
    // Проверка, существует ли уже администратор с таким email
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).send('Admin with this email already exists.');
    }
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(pass, 10);
    // Создание нового администратора
    const newAdmin = new Admin({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Сохранение нового администратора в базе данных
    await newAdmin.save();

    // Отправка успешного ответа
    return res.status(201).send(resMess);

  } catch (error) {
    console.error('Произошла ошибка:', error);
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});
regauth.get('/admin', (req, res) => {
  res.send('This is the Profile Page!');
});

// Экспорт маршрутизатора
module.exports = regauth;

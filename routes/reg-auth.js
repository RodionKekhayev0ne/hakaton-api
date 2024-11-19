// routes.js
const express = require('express');
const regauth = express.Router();
const Student = require('../database/tables/student');
const Teacher = require('../database/tables/teacher');
const Admin = require('../database/tables/admin');
const bcrypt = require('bcrypt');
const {createTransport} = require("nodemailer");
const {sign} = require("jsonwebtoken");


regauth.use(express.json());
regauth.use(express.urlencoded({ extended: true }));

const SECRET_KEY = 'AffAghhg3hjfe298fh32iuf443f233';
async function sendEmail(recipient, name, lastName, pass, login) {
  try {
    // Настройка транспортного объекта
    const transporter = createTransport({
      host: 'smtp.mail.ru', // SMTP-сервер (например, smtp.gmail.com для Gmail)
      port: 465, // Обычно 587 (TLS) или 465 (SSL)
      secure: true, // true для порта 465, false для остальных
      auth: {
        user: 'Kekhayev.r@mail.ru', // Ваш email
        pass: 'EATd01zq27ub4pNNZ2Xf', // Ваш пароль
      },
      tls: {
        rejectUnauthorized: false, // Отключает проверку сертификата
      },
    });
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .info {
            font-size: 18px;
            color: #555;
          }
          .info span {
            font-weight: bold;
            color: #000;
          }
        </style>
      </head>
      <body>
        <p class="greeting">Здравствуйте, <span>${name} ${lastName}</span></p>
        <p class="info">Login: <span>${login}</span></p>
        <p class="info">Password: <span>${pass}</span></p>
      </body>
      </html>
    `;
    // Настройка письма
    const mailOptions = {
      from: '"Hakaton task" <Kekhayev.r@mail.ru>', // Отправитель
      to: recipient, // Получатель (можно указать несколько через запятую)
      subject: 'Authorization data', // Тема письма
      html: htmlContent, // HTML-версия письма
    };

    // Отправка письма
    const info = await transporter.sendMail(mailOptions);
    console.log('Email отправлен: %s', info.messageId);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
}


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
    await sendEmail(email, name, lastname, pass, phone)
    // Если сохранение прошло успешно, отправляем ответ с кодом 201
    return res.status(201).send(resMess);

  } catch (error) {
    console.error('Произошла ошибка:', error);

    // В случае ошибки отправляем ответ с кодом 400 и сообщением об ошибке
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});
regauth.post('/student/auth', async (req, res) => {
  const {phone, pass} = req.body;

  try {

    const student = await Student.findOne({
      phoneNumber: phone
    })

    const isMatch = await bcrypt.compare(pass, student.password);

    if(isMatch){
      console.log("Student " + student.name + " authorized")

      res.status(200).json({
        auth_success: true,
        id: student._id,
        name: student.name,
        last_name: student.lastName,
      })
    }else {
      res.status(403).json({
        auth_success: false,
      })
    }



  } catch (error) {
    console.error('Произошла ошибка:', error);

    // В случае ошибки отправляем ответ с кодом 400 и сообщением об ошибке
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
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
    await sendEmail(email, name, lastName, pass, phoneNumber)
    // Отправка успешного ответа
    return res.status(201).send(resMess);

  } catch (error) {
    console.error('Произошла ошибка:', error);
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});
regauth.post('/teacher/auth', async (req, res) => {
  const {phone, pass} = req.body;

  try {

    const teacher = await Teacher.findOne({
      phoneNumber: phone
    }).populate('lessons');

    const isMatch = await bcrypt.compare(pass, teacher.password);

    if (isMatch) {
      res.status(200).json({
        auth_success: true,
        id: teacher._id,
        name: teacher.name,
        last_name: teacher.lastName,
        lessons: teacher.lessons,
      })
    } else {
      res.status(403).json({
        auth_success: false,
      })
    }


  } catch (error) {
    console.error('Произошла ошибка:', error);

    // В случае ошибки отправляем ответ с кодом 400 и сообщением об ошибке
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
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
regauth.post('/admin/auth', async (req, res) => {
  const {email, pass} = req.body;

  try {

    const admin = await Admin.findOne({
      email: email
    })

    const isMatch = await bcrypt.compare(pass, admin.password);

    if (isMatch) {
      const token = sign({ id: admin._id, username: admin.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
      res.cookie('userToken', token, {
        httpOnly: true,  // Cookie недоступно через JavaScript на клиенте
        secure: false,   // Установите `true`, если используете HTTPS
        sameSite: 'lax', // Контроль отправки cookie между сайтами
        maxAge: 24 * 60 * 60 * 1000, // Время жизни cookie (1 день)
      });


      res.status(200).json({
        auth_success: true,
        id: admin._id,
        name: admin.name
      })

    } else {
      res.status(403).json({
        auth_success: false,
      })
    }


  } catch (error) {
    console.error('Произошла ошибка:', error);

    // В случае ошибки отправляем ответ с кодом 400 и сообщением об ошибке
    return res.status(400).send('Произошла ошибка: ' + error.message);
  }
});

// Экспорт маршрутизатора
module.exports = regauth;



// index.js
const dbconnect = require('./database/db-connection')
const http = require('http');
const express = require('express');
const app = express();
const regauth = require('./routes/reg-auth')
const student = require('./routes/student-funcs')
const teacher = require('./routes/teacher-funcs')
const admin = require('./routes/admin-funcs')
const visit = require('./routes/visit')
const Admin = require('./database/tables/admin');
const cors = require('cors');

app.use(express.json());

// Middleware для обработки данных формы (URL-encoded)
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://209.38.196.77:3001', // Разрешить доступ только с этого домена
};

app.use(cors(corsOptions));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
dbconnect();


function sendMessage(){
    const message = 'API is working, don`t worry be happy!!!' + '\n' + 'GitHub Hooks also working!!!'
    console.log(message)
    return message
}
app.use('/regauth', regauth);
app.use('/student', student);
app.use('/teacher', teacher);
app.use('/admin', admin);
app.use('/visit', visit);
sendMessage()

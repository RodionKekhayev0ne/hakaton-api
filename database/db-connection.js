const mongoose = require('mongoose');

// URL для подключения к базе данных MongoDB

const dbconnect = async () => {
// Подключение к базе данных
  const mongoURI = 'mongodb+srv://Rodion:12345@jeteyedb.x8fg9np.mongodb.net/hakaton';
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('MongoDB connected!!!');
    })
    .catch((error) => {
      console.error('Ошибка подключения к MongoDB:', error);
    });
}
module.exports = dbconnect;

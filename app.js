// index.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const message = 'API is working, don`t worry be happy!!!' + '\n' + 'GitHub Hooks also working in api!!!'+ '\n' + 'powered by Kekhayev Rodion'
    res.end(message);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});




function sendMessage(){
    const message = 'API is working, don`t worry be happy!!!' + '\n' + 'GitHub Hooks also working!!!'
    console.log(message)
    return message
}

sendMessage()

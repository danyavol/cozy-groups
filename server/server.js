require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3080;  

const router = require('./src/routes/index');
//const api = require('./src/routes/api.js');
//app.use('/api', api);

/* 
Каждый ответ сервера содержит следующие поля:
{
    ok: Boolean, // выполнился запрос или не выполнился
    message: String // дополнительное сообщение с пояснением
}
*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Запросы на сервер разрешены только с того же домена и с домена ниже
app.use( cors({origin: 'http://localhost:3000'}) );

app.use('/', router);

app.use((req, res, next) => {
    const err = new Error('Не найдено!');
    err.status = 404;
    next(err);   
});
  
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        ok: false,
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
});
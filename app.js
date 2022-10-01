const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

// Settings
app.set('port', process.env.PORT || 3000)

// Routes
app.use(require('./routes/recuerdos'))
app.use(require('./routes/webhooks'))

// Starting the server
app.listen(app.get('port'), ()=>{
    console.log('[Log 1/2] Server runing on port ', app.get('port'))
})
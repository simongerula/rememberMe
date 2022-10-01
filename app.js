const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());

// Settings
app.set('port', process.env.PORT || 3000)

// Routes
app.use(require('./routes/recuerdos'))

// Starting the server
app.listen(app.get('port'), ()=>{
    console.log('[Log 1/2]Server runing on port ', app.get('port'))
})
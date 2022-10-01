const mysql = require('mysql')

// https://www.freemysqlhosting.net/
const mysqlConnection = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6522509',
    password: 'ESwLJYYMSF',
    database: 'sql6522509'
})

mysqlConnection.connect(function(err){
    if(err){
        console.log(err)
        return
    } else {
        console.log('[Log 2/2] Base de datos conectada')
    }
})


module.exports = mysqlConnection
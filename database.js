const mysql = require('mysql')
const cron = require('./cron')

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
        console.log('[Log 2/3] Database connected')
        cron.runCron()
        console.log('[Log 3/3] Cron running')
    }
})


module.exports = mysqlConnection
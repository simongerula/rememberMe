const cron = require('node-cron')
const querys = require('./routes/querys')


function runCron() {
    console.log('Cron Activado')
    cron.schedule('* * * * *', ()=>{
        peticiones.enviarRecordatorios()
    })
}

module.exports = {
    "runCron" : runCron
}

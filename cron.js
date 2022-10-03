const cron = require('node-cron')
const querys = require('./routes/querys')


function runCron() {
    console.log('[Log 3/3] Cron running')
    cron.schedule('* * * * *', ()=>{
        console.log('aca?')
        querys.sendMemories()
    })
}

module.exports = {
    "runCron" : runCron
}

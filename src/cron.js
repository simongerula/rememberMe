const cron = require('node-cron')
const querys = require('./querys')


function runCron() {
    console.log('[Log 3/3] Cron running')
    cron.schedule('*/2 * * * *', ()=>{
        querys.sendMemories()
    })
}

module.exports = {
    "runCron" : runCron
}

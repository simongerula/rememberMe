const request = require('request')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

function createMemory(sender_psid, txt_memory, remember_at) {
    
    const requestBody = {
        'sender_psid': sender_psid,
        'txt_memory': txt_memory,
        'remember_at': remember_at,
        'status': 'Pending'
    }
    request({
        'url': 'https://remember-me-api.herokuapp.com/memories',
        'method': 'POST',
        'headers': { 
            'Content-Type': 'application/json'
        },
        'json': requestBody
    }, (err, res, body) => {
        if(!err){
            sendMessageConfirmation(sender_psid, txt_memory, remember_at)
            console.log('Sender id ', sender_psid)
            console.log('fecha ', remember_at)
        } else {
            sendCustomMessage(sender_psid, "I'm sorry, I couldn't save your memory")
        }
    })



}

function sendMessageConfirmation(sender_psid, txt_memory, remember_at) {
    const requestBody = {
        'recipient': {
            'id': sender_psid
        },
        'message': {'text': `Got it! I'll remember you: ${txt_memory} , 🗓 ${remember_at} `},
        'messaging_type': 'RESPONSE',
    }
    request({
        'url': 'https://graph.facebook.com/v15.0/me/messages',
        'qs': {'access_token': PAGE_ACCESS_TOKEN},
        'method': 'POST',
        'json': requestBody
    }, (err, res, body) => {
        if(!err){
            console.log('Respuesta enviada')
        } else {
            console.error('No se pudo enviar el mensaje')
        }
    })
}

function sendCustomMessage(sender_psid, txt_message) {
    const requestBody = {
        'recipient': {
            'id': sender_psid
        },
        'message': {'text': txt_message},
        'messaging_type': 'RESPONSE',
    }
    request({
        'url': 'https://graph.facebook.com/v15.0/me/messages',
        'qs': {'access_token': PAGE_ACCESS_TOKEN},
        'method': 'POST',
        'json': requestBody
    }, (err, res, body) => {
    })
}

function sendMemories() {
    
    request({
        url: 'https://recuerdame-api.herokuapp.com/cron',
        method: 'GET',
        headers: { }
    }, (err,response,body) => {
        console.log(response)
        if(JSON.stringify(response) == '"No pending memories found"'){
            // Nothing
        } else {
            console.log(reponse.body)
            let memories = response 
            for(const i in memories){
                /*if(memories[i].reply_msg == 0){*/
                sendCustomMessage(memories[i].sender_psid, `Hi! Don't forget to: ${memories[i].txt_memory}`)
                    //cliente.sendMessage(recuerdos[i].num_usuario,`Hola! No te olvides de:  ${recuerdos[i].txt_recuerdo}`)
                /*} else if(recuerdos[i].reply_msg == 1){
                    msg_id = (JSON.parse(recuerdos[i].msg_id))
                    //////////////// <-------------------->
                    msgObject.mediaKey = msg_id.mediaKey
                    msgObject.id = msg_id.id
                    msgObject.body = msg_id.body
                    msgObject.timestamp = msg_id.timestamp
                    msgObject.from = msg_id.from
                    msgObject.to = msg_id.to
                    msgObject.from = msg_id.from
                    //////////////// <-------------------->
                    msgObject.reply(`Hola! No te olvides de: ${recuerdos[i].txt_recuerdo}`)
                }*/
                let current_date = new Date().toLocaleString("en-US", {timeZone: 'Pacific/Auckland'})
                current_date = new Date(current_date)

                let cron_date = current_date.getFullYear() + "-" + (current_date.getMonth()+1) + "-" + current_date.getDate() + " " + current_date.getHours() + ":" + current_date.getMinutes() + ":" + current_date.getSeconds()
                console.log('Ultimo recuerdo enviado ' + cron_date)
            }
        }
    })
}

module.exports = {
    'createMemory': createMemory,
    'sendCustomMessage': sendCustomMessage,
    'sendMemories': sendMemories
}
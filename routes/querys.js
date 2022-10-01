const request = require('request')

let msgObject = {}

function createMemory(sender_psid, txt_memory, remember_at) {
    
    const requestBody = {
        'sender_psid': sender_psid,
        'message': txt_memory,
        'date_to_remember': remember_at
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
            sendMessage(sender_psid, txt_memory, remember_at)
        } else {
            console.error('fallo createMemory')
        }
    })



}

function sendMessage(sender_psid, txt_memory, remember_at) {
    const requestBody = {
        'recipient': {
            'id': sender_psid
        },
        'message': {'text': `Got it! I'll remember you: ${txt_memory} , ${remember_at} `},
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

module.exports = {
    'createMemory': createMemory
}
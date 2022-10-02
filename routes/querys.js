const request = require('request')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

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
            sendMessageConfirmation(sender_psid, txt_memory, remember_at)
        } else {
            console.error('fallo createMemory')
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

function sendMessageUnknown(sender_psid) {
    const requestBody = {
        'recipient': {
            'id': sender_psid
        },
        'message': {'text': `I'm sorry, I couldn't undertand your message`},
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

module.exports = {
    'createMemory': createMemory,
    'sendMessageUnknown': sendMessageUnknown
}
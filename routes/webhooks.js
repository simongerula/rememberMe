const express = require('express')
const router = express.Router()

const axios = require('axios')
const request = require('request')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

// Setup for Facebook integration
router.get('/webhook', (req,res) =>{
    const VERIFY_TOKEN = 'RememberMe2334255NZ'

    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN){
        console.log('Webhook facebook verificado')
        res.send(challenge)        
    }
    else {
        res.statusCode = 401
    }
})

// Reading messages
router.post('/webhook', (req,res) => {
    const body = req.body
    if(body.object === 'page'){
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0]

            const msgTxt = webhookEvent.message.text
            const sender_psid = webhookEvent.sender.id

            // If it contains remember , rememberme or remember me
            if (/remember/i.test(msgTxt) || /rememberme/i.test(msgTxt) || /remember me/i.test(msgTxt)){
                console.log('Memory detected')

                // responder mensaje
                /*const requestBody = {
                    'recipient': {
                        'id': sender_psid
                    },
                    'messaging_type': RESPONSE,
                    'message': {'text':'hello,world'},
                    'access_token': PAGE_ACCESS_TOKEN
                }
                let config = {
                    method: 'POST',
                    url: 'https://graph.facebook.com/v15.0/me/messages',
                    qs: {'access_token': PAGE_ACCESS_TOKEN},
                    json: requestBody
                  };
                axios(config)
                .catch(function (error) {
                    console.log(error)
                })*/

                const requestBody = {
                    'recipient': {
                        'id': sender_psid
                    },
                    'message': {'text': 'OK'},
                    'messaging_type': 'MESSAGE_TAG',
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
            else {
                console.log("I'm sorry I couldn't understand your message")
            }

        })
        res.send('ok')
        console.log('Evento Recibido')
    }
})

module.exports = router
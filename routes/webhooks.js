const express = require('express')
const router = express.Router()

const axios = require('axios')

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
                const requestBody = {
                    'recipient': {
                        'id': sender_psid
                    },
                    'message': 'OK'
                }
                let config = {
                    method: 'POST',
                    url: 'https://graph.facebook.com/v2.6/me/messages/',
                    qs: {'access_token': PAGE_ACCESS_TOKEN},
                    json: requestBody
                  };
                axios(config)
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
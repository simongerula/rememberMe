const express = require('express')
const router = express.Router()

const request = require('request')

const querys = require('./querys')

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

                let txt_memory
                let remember_at
                let remember_at_index

                // Find the position of text to memorize
                if(/remember me/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remember me')
                }
                else if (/remember/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remember')
                }
                else if (/rememberme/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('rememberme')
                }

                let date_today = new Date()

                txt_memory = msgTxt.slice(0,remember_at_index)
                remember_at = msgTxt.slice(remember_at_index+8) // repasar

                // Hour detailed (HH:MM)
                if(/:/.test(remember_at) && !/\//.test(remember_at) && !/tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wendsday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_hour = remember_at.slice(remember_at.indexOf(':')-2, remember_at.indexOf(':')+3)
                    remember_at = date_today.getFullYear() + "-" + (date_today.getMonth()+1) + "-" + date_today.getDate() + " " + remember_at_hour + ":00"

                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // Date detailed (DD/MM/YYYY)


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
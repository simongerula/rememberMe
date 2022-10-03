const express = require('express')
const router = express.Router()

const request = require('request')
const { sendMessage } = require('./querys')

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
            if (/remember/i.test(msgTxt) || /rememberme/i.test(msgTxt) || /remember me/i.test(msgTxt) || /remind me/i.test(msgTxt) || /remindme/i.test(msgTxt)){
                console.log('Memory detected')

                let txt_memory
                let remember_at
                let remember_at_index

                // Find the position of text to memorize
                if(/rememberme/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('rememberme')
                }
                else if (/remember me/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remember me')
                }
                else if (/remember/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remember')
                }
                else if (/remindme/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remindme')
                }
                else if (/remind me/i.test(msgTxt)){
                    remember_at_index = msgTxt.indexOf('remind me')
                }

                let date_today = new Date().toLocaleString("en-US", {timeZone: 'Pacific/Auckland'})
                date_today = new Date(date_today)

                txt_memory = msgTxt.slice(0,remember_at_index)
                remember_at = msgTxt.slice(remember_at_index+8) // repasar

                // Hour detailed (HH:MM)
                if(/:/.test(remember_at) && !/\//.test(remember_at) && !/tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wednesday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_hour = remember_at.slice(remember_at.indexOf(':')-2, remember_at.indexOf(':')+3)
                    remember_at = date_today.getFullYear() + "-" + (date_today.getMonth()+1) + "-" + date_today.getDate() + " " + remember_at_hour + ":00"

                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // Date detailed (DD/MM/YY)
                else if (!/:/.test(remember_at) && /\//.test(remember_at) && !/tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wednesday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_date = remember_at.slice(remember_at.indexOf('/')-2, remember_at.indexOf('/')+6)
                    const remember_at_year = remember_at_date.slice(-2)
                    const remember_at_month = remember_at_date.slice(-5,-3)
                    const remember_at_day = remember_at_date.slice(0,2)

                    if(parseInt(remember_at_month) > 12){
                        
                    }
                    else if(parseInt(remember_at_day) > 31){

                    }
                    else if(parseInt(remember_at_year) > 99){

                    }
                    else {
                        remember_at = "20" + remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " " + "09:00:00"
                        querys.createMemory(sender_psid, txt_memory, remember_at)
                    }
                }

                // Tomorrow detailed
                else if (!/:/.test(remember_at) && !/\//.test(remember_at) && /tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wednesday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_day = date_today.getDate(date_today.setDate(date_today.getDate()+1))
                    const remember_at_month = date_today.getMonth()+1
                    const remember_at_year = date_today.getFullYear()
        
                    remember_at = remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " 09:00:00"
                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // Day of the week detailed
                else if(!/:/.test(remember_at) && !/\//.test(remember_at) && !/tomorrow/.test(remember_at) && (/monday/.test(remember_at) || /tuesday/.test(remember_at) || /wednesday/.test(remember_at) || /thursday/.test(remember_at) || /friday/.test(remember_at) || /saturday/.test(remember_at) || /sunday/.test(remember_at)) && !/minute/.test(remember_at)){
                    let remember_at_day_target
                    if(/monday/.test(remember_at)){
                        remember_at_day_target = 1
                    } else if (/tuesday/.test(remember_at)){
                        remember_at_day_target = 2
                    } else if (/wensday/.test(remember_at)){
                        remember_at_day_target = 3
                    } else if (/thursday/.test(remember_at)){
                        remember_at_day_target = 4
                    } else if (/friday/.test(remember_at)){
                        remember_at_day_target = 5
                    } else if (/saturday/.test(remember_at)){
                        remember_at_day_target = 6
                    } else if (/sunday/.test(remember_at)){
                        remember_at_day_target = 0
                    }
                    let remember_at_day_left = (remember_at_day_target - date_today.getDay())
                    if (remember_at_day_left <= 0){
                        remember_at_day_left += 7
                    }
                    const remember_at_day = date_today.getDate(date_today.setDate(date_today.getDate()+remember_at_day_left))
                    const remember_at_month = date_today.getMonth()+1
                    const remember_at_year = date_today.getFullYear()
        
                    remember_at = remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " 09:00:00"
                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // Date + Hour detailed
                else if (/:/.test(remember_at) && /\//.test(remember_at) && !/tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wednesday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_hour = remember_at.slice(remember_at.indexOf(':')-2, remember_at.indexOf(':')+3)
                    const remember_at_date = remember_at.slice(remember_at.indexOf('/')-2, remember_at.indexOf('/')+6)
                    const remember_at_year = remember_at_date.slice(-2)
                    const remember_at_month = remember_at_date.slice(-5,-3)
                    const remember_at_day = remember_at_date.slice(0,2)
                    if(parseInt(remember_at_month) > 12){
                    }
                    else if(parseInt(remember_at_day) > 31){
                    }
                    else if(parseInt(remember_at_year) > 99){
                    }
                    else {
                        remember_at = "20" + remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " " + remember_at_hour + ":00"
                        querys.createMemory(sender_psid, txt_memory, remember_at)
                    }
                } 

                // Tomorrow + Hour detailed
                else if(/:/.test(remember_at) && !/\//.test(remember_at) && /tomorrow/.test(remember_at) && !/monday/.test(remember_at) && !/tuesday/.test(remember_at) && !/wednesday/.test(remember_at) && !/thursday/.test(remember_at) && !/friday/.test(remember_at) && !/saturday/.test(remember_at) && !/sunday/.test(remember_at) && !/minute/.test(remember_at)){
                    const remember_at_hour = remember_at.slice(remember_at.indexOf(':')-2, remember_at.indexOf(':')+3)    
                    const remember_at_day = date_today.getDate(date_today.setDate(date_today.getDate()+1))
                    const remember_at_month = date_today.getMonth()+1
                    const remember_at_year = date_today.getFullYear()
        
                    remember_at = remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " " + remember_at_hour + ":00"
                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // Day + Hour detailed
                else if(/:/.test(remember_at) && !/\//.test(remember_at) && !/tomorrow/.test(remember_at) && (/monday/.test(remember_at) || /tuesday/.test(remember_at) || /wednesday/.test(remember_at) || /thursday/.test(remember_at) || /friday/.test(remember_at) || /saturday/.test(remember_at) || /sunday/.test(remember_at)) && !/minute/.test(remember_at)){
                    const remember_at_hour = remember_at.slice(remember_at.indexOf(':')-2, remember_at.indexOf(':')+3)    
                    let remember_at_day_target
                    if(/monday/.test(remember_at)){
                        remember_at_day_target = 1
                    } else if (/tuesday/.test(remember_at)){
                        remember_at_day_target = 2
                    } else if (/wednesday/.test(remember_at)){
                        remember_at_day_target = 3
                    } else if (/thursday/.test(remember_at)){
                        remember_at_day_target = 4
                    } else if (/friday/.test(remember_at)){
                        remember_at_day_target = 5
                    } else if (/saturday/.test(remember_at)){
                        remember_at_day_target = 6
                    } else if (/sunday/.test(remember_at)){
                        remember_at_day_target = 0
                    }
                    let remember_at_day_left = (remember_at_day_target - date_today.getDay())
                    if (remember_at_day_left <= 0){
                        remember_at_day_left += 7
                    }
                    const remember_at_day = date_today.getDate(date_today.setDate(date_today.getDate()+remember_at_day_left))
                    const remember_at_month = date_today.getMonth()+1
                    const remember_at_year = date_today.getFullYear()
        
                    remember_at = remember_at_year + "-" + remember_at_month + "-" + remember_at_day + " " + remember_at_hour + ":00"
                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }

                // minutes detailed
                else if(!/:/.test(remember_at) && !/\//.test(remember_at) && !/tomorrow/.test(remember_at) && (!/monday/.test(remember_at) || !/tuesday/.test(remember_at) || !/wednesday/.test(remember_at) || !/thursday/.test(remember_at) || !/friday/.test(remember_at) || !/saturday/.test(remember_at) || !/sunday/.test(remember_at)) && /minute/.test(remember_at)){
                    const minutes_quantity = remember_at.slice(remember_at.indexOf('minute')-3, remember_at.indexOf('minute')-1)
                    const remember_at_minutes = date_today.getDate(date_today.setMinutes(date_today.getMinutes()+parseInt(minutes_quantity)))
                    const minutes = date_today.getMinutes() > 9 ? date_today.getMinutes() : '0' + date_today.getMinutes()
                    remember_at = date_today.getFullYear() + "-" + (date_today.getMonth()+1) + "-" + date_today.getDate() + " " + date_today.getHours() + ":" + date_today.getMinutes() + ":00"

                    querys.createMemory(sender_psid, txt_memory, remember_at)
                }
            }

            // Hi
            else if(/hi/i.test(msgTxt)){
                querys.sendCustomMessage(sender_psid, 'Hi! Welcome to RememberMe Bot')
                querys.sendCustomMessage(sender_psid, 'To see the options you can write me help')
            } 

            // Help
            else if (/help/i.test(msgTxt)){
                querys.sendCustomMessage(sender_psid, `I show you examples of how you can save a memory:
Memory + remind me + when
Turn off the oven remind me in 5 minutes,
Go to the doctor remind me at 18,
Uncle's birthday remind me of 01/01/22,
Recyclable trash remind me tomorrow,
Groceries remind me tuesday,`)
            }

            // Unknown message
            else {
                querys.sendCustomMessage(sender_psid, `I'm sorry, I couldn't undertand your message`)
            }
        })
        res.send('ok')
        console.log('Evento Recibido')
    }
})

module.exports = router
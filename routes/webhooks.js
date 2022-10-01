const express = require('express')
const router = express.Router()

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

module.exports = router
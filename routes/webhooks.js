const express = require('express')
const router = express.Router()

router.get('/webhooks', (req,res) =>{
    const VERIFY_TOKEN = 'RememberMe2334255NZ'

    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']

    if (mode === 'suscribe' && token === VERIFY_TOKEN){
        res.send("Welcome to Recuerdame API")
    }
})

module.exports = router
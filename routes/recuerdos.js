const express = require('express')
const router = express.Router()

const mysqlConnection = require('../database')

router.get('/', (req,res) =>{
    res.send("Welcome to Recuerdame API")
})

router.get('/recuerdos', (req,res) =>{
    mysqlConnection.query('SELECT * FROM recuerdos', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        } else {
            console.log(err)
        }
    })
})

router.get('/recuerdos/:id', (req,res) => {
    const { id } = req.params
    mysqlConnection.query('SELECT * FROM recuerdos WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0])
        } else {
            res.json('No se encontro el recuerdo')
            console.log(err)
        }
    })
})

router.get('/cron', async (req,res) =>{
    let rowsT
    //const fecha_hoy = new Date()
    let fecha_hoy = new Date().toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"})
    fecha_hoy = new Date(fecha_hoy)
    const fecha_actual = fecha_hoy.getFullYear() + "-" + (fecha_hoy.getMonth()+1) + "-" + fecha_hoy.getDate() + " " + fecha_hoy.getHours() + ":" + fecha_hoy.getMinutes() + ":" + fecha_hoy.getSeconds()
    console.log(fecha_actual)
    /*    mysqlConnection.query('SELECT * FROM recuerdos WHERE status = "Pending" AND recordar_at <= ?', [fecha_actual], (err, rows, fields) => {
        if(!err){
            for(const i in rows){
                console.log(rows[i].id)
                mysqlConnection.query('UPDATE recuerdos SET status = "Processed" where id = ?', [rows[i].id], (err, rows, fields) => {
                    if(!err){
                        res.json("UPDATE OK")
                    } else {
                        res.json('UPDATE FAIL')
                        console.log(err)
                    }
                })                
            }
            if(rows == ""){
                res.json("No se encontraron recuerdos pendientes")
            } else {
                res.json(rows)
            }
        } else {
            res.json('Fallo al recuperar recuerdos para cron')
            console.log(err)
        }
    })
})*/
    mysqlConnection.query('SELECT * FROM recuerdos WHERE status = "Pending" AND recordar_at <= ?', [fecha_actual], (err, rows, fields) => {
        if(!err){
            if(rows == ""){
                res.json("No se encontraron recuerdos pendientes")
            } else {
                res.json(rows)
            }
            rowsT = rows
        } else {
            res.json('Fallo al recuperar recuerdos para cron')
            console.log(err)
        }
    })
    await sleep(2000)
    function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
    }  
    for(const i in rowsT){
        console.log(rowsT[i].id)
        mysqlConnection.query('UPDATE recuerdos SET status = "Processed" where id = ?', [rowsT[i].id], (err, rows, fields) => {
        })                
    }
})

router.post('/recuerdos', (req,res) => {
    const { num_usuario, txt_recuerdo, recordar_at, msg_id, reply_msg} = req.body
    mysqlConnection.query('INSERT INTO recuerdos (num_usuario, txt_recuerdo, status, recordar_at, msg_id, reply_msg) VALUES(?, ?, "Pending", ?, ?, ?)', [num_usuario, txt_recuerdo, recordar_at, msg_id, reply_msg], (err) =>{
        if(!err){
            res.json("Recuerdo creado con exito")
        } else {
            res.json('Fallo al crear recuerdo')
            console.log(err)
        }
    })
})

router.put('/recuerdos/:id', (req,res) => {
    const { txt_recuerdo, recordar_at } = req.body
    const { id } = req.params
    mysqlConnection.query('UPDATE recuerdos SET txt_recuerdo = ? , recordar_at = ? WHERE id = ?', [txt_recuerdo, recordar_at, id], (err) => {
        if(!err){
            res.json("Recuerdo editado con exito")
        } else {
            res.json('Fallo al editar el recuerdo')
            console.log(err)
        } 
    })
})

router.delete('/recuerdos/:id', (req,res) => {
    const { id } = req.params
    mysqlConnection.query('DELETE FROM recuerdos WHERE id = ?', [id], (err) => {
        if(!err){
            res.json("Recuerdo eliminado con exito")
        } else {
            res.json('Fallo al eliminar el recuerdo')
            console.log(err)
        } 
    })

})

module.exports = router
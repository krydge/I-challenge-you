const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()
const { Pool } = require('pg')
const PORT = 3000
const Challenge = require('./model/challenge')
app.use(cors())
app.use(bodyparser.json())

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'mysecretpassword',
    port: '5432',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

app.route('/')
    .get((req, res) => {

        res.status(200)
        res.send("Challenge me api running")
    })


app.route('/challenges')
    .get((req, res) => {
        pool.query(`SELECT *
        FROM public.challenge;
        `, (err, result) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            console.log(result.rows)
            res.status(200)
            res.send(result.rows)
        })
    })

app.route('/challenge')
    .get((req, res) => {
        let challenge_id = req.body.id;
        pool.query(`SELECT *
        FROM public.challenge where id=${challenge_id};
        `, (err, challenge) => {
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            else {
                pool.query(`SELECT id, record_holder_id, unit, challenge_id
                FROM public.record where challenge_id = ${challenge.rows[0].id};
                `, (error, records) => {
                    if (error) {
                        return console.error('Error executing query', err.stack)
                    } else {
                        console.log({ "challenge": challenge.rows[0], "records": records.rows })
                        res.status(200)
                        res.send({ "challenge": challenge.rows[0], "records": records.rows })
                    }
                })
            }
        })
    })
    .post((req, res) => {
        const challenge = new Challenge(req.body.name, req.body.unit, req.body.upordown, 0)
        console.log(challenge)
        pool.query(`INSERT INTO public.challenge
            (record_name, measurment, up_down)
            VALUES('${challenge.record_name}', '${challenge.measurement}', ${challenge.up_down});`
            , (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                console.log(result.rows[0])
                res.status(200)
                res.send("added challenge")
            })
    })

    app.route('/record')
    .get((req,res)=>{

    })
    .post((req,res)=>{
        let record = req.body.record
        
    })

app.listen(PORT, (error) => {
    if (error) {
        console.log("Error starting server")
    }
    else {
        console.log("Server started, Listening on port:" + PORT)
    }
})
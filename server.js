const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Dotenv for .env file config
dotenv.config();

const app = express();

const urlpath = '';
const port = process.env.port || 3000;

// Database Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// Middleware
app.use(express.json());

app.get(urlpath+'/', (req, res)=>{
    res.send({name: "Rehan"}).status(200);
});

app.get(urlpath+'/add', (req, res)=>{
    connection.connect();
    const id = req.query.id
    res.send(id).status(200);
});

app.get(urlpath+'/todolist/:id', (req, res)=>{
    connection.connect();
    const id = req.params.id;
    console.log(id)
    connection.query("SELECT * FROM todolist WHERE id=?", [id], (err, result, fields)=>{
        if (err) throw err;
        res.json(result).status(200);
    });
});

app.get(urlpath+'/todolist', (req, res)=>{
    connection.connect();
    connection.query("SELECT * FROM todolist", (err, result, fields)=>{
        if (err) throw err;
        res.json(result).status(200);
    });
});

app.post(urlpath+'/todolist', (req, res)=>{
    connection.connect();
    const heading = req.body.heading;
    const note = req.body.note;
    console.log(heading, note);
    connection.query("INSERT INTO todolist (heading, note)values(?, ?)", [heading, note], (err, result, fields)=>{
        if (err) throw err;
        res.json({message: "Successfully Inserted"}).status(200);
    });
});

app.put(urlpath+'/todolist', (req, res)=>{
    connection.connect();
    const heading = req.body.heading;
    const note = req.body.note;
    const id = req.body.id;
    console.log(heading, note);
    connection.query("UPDATE todolist SET heading=?, note=? WHERE id=?", [heading, note, id], (err, result, fields)=>{
        if (err) throw err;
        res.json({message: "Successfully Updated"}).status(200);
    });
});

app.delete(urlpath+'/todolist/:id', (req, res)=>{
    connection.connect();
    const id = req.params.id;
    connection.query("DELETE FROM todolist WHERE id=? LIMIT 1", [id], (err, result, fields)=>{
        if (err) throw err;
        res.json({message: "Successfully Deleted"}).status(200);
    });
});

app.listen(port, ()=>{
    console.log(`Server is Running on PORT ${port}`);
});
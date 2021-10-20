const express = require('express');
const fs = require('fs');
//const db = require('./db/db.json');
const uniqid = require('uniqid');
const dbUtils = require('./db/dbUtils.js')

let PORT = process.env.PORT || 3000;

//express app
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Specifies root dir for serving static files
app.use(express.static('public'));

//listen for requests
app.listen(`${PORT}`);

//Response routes//
//requests for the root folder go to index.html
app.get('/', (req, res) => {
    res.sendFile('./public/index.html', {root: __dirname});
});

//GET request notes
app.get('/notes', (req, res) => {
    res.sendFile('./public/notes.html', {root: __dirname});
});

//API routes
//GET API Notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
    
})

//POST API Notes
app.post('/api/notes',(req, res) => {
    //console.info(`${req.method} request received to add note.`);
    //console.info(req.body)
    let entry = {
        id: uniqid(),
        title: req.body.title,
        text: req.body.text
    }

    fs.readFile('db/db.json', 'utf8', (err, json) => {
        //Add the new entry to the arr
        const arr = JSON.parse(json);
        arr.push(entry);
        const arrString = JSON.stringify(arr, null, 2);
        
        //Write the new array back to the file
        fs.writeFile('./db/db.json', arrString, (err) => {
            if(err) {
                console.log(err);
                return;
            }
            else {
                const response = {
                    status: 'success',
                    body: arrString,
                };
              
                console.log(response);
                res.status(201).json(response);
            }
        })
    });
})

//DELETE API Notes
app.delete('/api/notes/*', (req, res) => {
    let path = req.path;
    let pathArr = path.split('/');
    let id = pathArr[pathArr.length - 1]

    fs.readFile('db/db.json', 'utf8', (err, json) => {
        //Remove from the arr by id
        let arr = JSON.parse(json);
        arr = arr.filter((x) => {
            return x.id !== id 
        })

        let arrString = JSON.stringify(arr, null, 2);

        //write new id to json
        fs.writeFile('db/db.json', arrString, (err) => {
            if(err) {
                console.log(err);
                return;
            }
            else {
                const response = {
                    status: 'success',
                    body: arr,
                };
              
                console.log(response);
                res.status(201).json(response);
            }
        })
    })
})

//404--launches if no above routes are used
app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', {root: __dirname});
})
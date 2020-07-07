var fs = require('fs')
var crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port=process.env.PORT || 3000
const connectionString = 'mongodb+srv://omomuro:sS92911026@cluster0.kzfxn.mongodb.net/<dbname>?retryWrites=true&w=majority'
app.use(bodyParser.urlencoded({extended: true}))


function randomValueHex(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
}

var username = randomValueHex(8)
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
MongoClient.connect(connectionString, options)
  .then(client => {
    //console.log('Connected to Database')
    //console.log('this is ok')
    const db = client.db('chatDB')
    const chatCollection = db.collection('chats')
    //console.log('connected to chat db')
    //console.log(username)
    app.set('view engine', 'ejs')

    app.get('/', function(req, res){
      db.collection('chats').find().toArray()
      .then(result => {
        res.render('index.ejs', {quotes: result, username: username})
      })
    })

    app.listen(port, function(req, res){
      //console.log(`Example app listening at http://localhost:${port}`)
    })

    app.post('/quotes', function(req, res){
      req.body['name'] = username
      chatCollection.insertOne(req.body)
        .then(result => {
          //console.log(result)
          //console.log('lkasjdflkajsdlkfjlaksdjflkasjldflkasdfjlsaf============');
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

  })
  .catch(console.error)

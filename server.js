const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const app = express()
const server = http.Server(app)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

// const Toio = require('./toio')
// const toio = new Toio()

server.listen(3000, () => {
  console.log('listening 3000')

//   toio.io = io
//   toio.init()
})
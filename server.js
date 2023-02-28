import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors'
const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)
const app = express()
const httpServer = createServer(app)
app.use(cors())

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(express.static(directory))

app.get('/', (req, res) => {
  res.sendFile(join(directory, '/public/index.html'))
})

// const Toio = require('./toio')
// const toio = new Toio()

httpServer.listen(4000, () => {
  console.log('listening 4000')

  // toio.io = io
  // toio.init()
})

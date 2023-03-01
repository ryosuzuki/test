import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cors from 'cors'
import { PythonShell } from 'python-shell'
import vision from '@google-cloud/vision'
import { ChatGPTAPI } from 'chatgpt'
const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)

const config = getJson('config.json')
const api = new ChatGPTAPI({
  apiKey: config.apiKey,
  completionParams: {
    temperature: 0.5,
    top_p: 0.8
  }
})

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

httpServer.listen(4000, () => {
  console.log('listening 4000')
})

io.on('connection', (socket) => {
  console.log('connected to: ' + socket.id)
  socket.emit('socketid', socket.id)

  socket.on('run_ocr', (msg) => {
    loadImage(msg).then(image => {
      const canvas = createCanvas(image.width, image.height)
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const data = context.getImageData(0, 0, canvas.width, canvas.height)
      var dataURL = canvas.toDataURL('image/jpeg')
      const imageBuffer = Buffer.from(dataURL.replace(/^data:image\/\w+base64,/, ''), 'base64')
      detectText(imageBuffer)
    }).catch(error => {
      console.error(error)
    })
  })

  let types = [
    'summary',
    'visualize'
  ]
  socket.emit('types', types)

  for (let type of types) {
    socket.on(type, async (msg) => {
      console.log('fejojo')
      let res = await ask(type, msg)
      socket.emit(type, res)
    })
  }
})

async function ask(type, msg) {
  // let res = await api.sendMessage(msg)
  // saveJson('sample/summary.json', msg)
  let res = getJson(`src/sample/${type}.json`)
  console.log(res)
  return res
}

function getJson(path) {
  return JSON.parse(fs.readFileSync(join(directory, path), 'utf8'))
}

function saveJson(path, json) {
  fs.writeFileSync(join(directory, path), JSON.stringify(json, 'null', 2))
}

const cred = join(directory, 'key.json');
const pic = join(directory, 'test.jpg');
const client = new vision.ImageAnnotatorClient({
  keyFilename: cred,
  projectId: 'ocr-reco-378000'
});

async function analyzeImage(filePath) {
  const [result] = await client.labelDetection(filePath);
  const labels = result.labelAnnotations.map(label => label.description);
  console.log('Labels:', labels);
}

async function detectText(image_buffer) {
  const [result] = await client.textDetection({ image: { content: image_buffer } });
  const rawtext = result.textAnnotations[0].description;
  // const text = result.fullTextAnnotation.text;
  const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ");
  console.log('Text:', text);
  let q = "I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: " + text;
  // pyshell.send(q);
}

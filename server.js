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

const config = JSON.parse(fs.readFileSync(join(directory, 'config.json'), 'utf8'))
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

  socket.on('summary', async (msg) => {
    console.log('ask summary')
    // pyshell.send(msg)
    let res = await ask(msg)
    console.log(res.text)
    socket.emit('summary', res)
  })
})

async function ask(msg) {
  // let res = await api.sendMessage(msg)
  let res = {
    role: 'assistant',
    id: 'cmpl-6p0azMarOkywSdX1Wye2bF4RwaMzK',
    parentMessageId: '87882780-b577-418c-9f55-a61212d4c97f',
    conversationId: 'affe478a-da19-4688-8bf3-c84c2303c7cb',
    text: 'Reality Extract is an augmented reality authoring tool that allows users to create interactive math textbooks through a data-driven approach. It provides six animation techniques such as dynamic graphs, exemplify equations, segmented color change, physics simulation, supporting lines and dynamic value slider to augment the textbook. The system has been evaluated with 12 students, who found it to be more engaging and understandable than static textbooks.',
    detail: {
      id: 'cmpl-6p0azMarOkywSdX1Wye2bF4RwaMzK',
      object: 'text_completion',
      created: 1677615037,
      model: 'text-davinci-003',
      choices: [ [Object] ],
      usage: { prompt_tokens: 1078, completion_tokens: 80, total_tokens: 1158 }
    }
  }
  console.log(res)
  return res
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

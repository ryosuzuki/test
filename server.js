const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const fs = require('fs');
const { fileURLToPath } = require('url');
const { dirname, join } = require('path');
const cors = require('cors');
const vision = require('@google-cloud/vision');
// const { ChatGPTAPI } = require('chatgpt');
const { image_search } = require('duckduckgo-images-api');
const path = require('path');

const utils = require('./UtilFunctions');

const {PythonShell} = require('python-shell')
const ExtractAction = new PythonShell('NLP.py')

// const key = fs.readFileSync('./key.pem');
// const cert = fs.readFileSync('./ip.pem');
const key = fs.readFileSync('./cert.key');
const cert = fs.readFileSync('./cert.crt');

const filename = path.basename(__filename);
const directory = path.dirname(filename);

const config = getJson('config.json')
// const api = new ChatGPTAPI({
//   apiKey: config.apiKey,
//   completionParams: {
//     temperature: 0.5,
//     top_p: 0.8
//   }
// })

const app = express()

const server = https.createServer({ key: key, cert: cert }, app);
const port = 4000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

app.use(express.static(directory))

server.listen(port, () => {
  console.log(`listening on ${port}`)
})

app.get('/', (req, res) => {
  res.sendFile(join(directory, '/public/index.html'))
})

app.get('/public/targets/2.mind', function(req, res) {
  console.log(res)
})

let currentTestingDoc = -1

io.on('connection', (socket) => {
  console.log('connected to: ' + socket.id)
  socket.emit('socketid', socket.id);

  ExtractAction.on('message', (action) => {
    console.log(action);
    io.emit("detectActionResponse", action);
  })
  socket.on('detectActionQuery', (sentence) => {
    // console.log(sentence)
    ExtractAction.send(sentence);
  })

  socket.on('currentTestingDoc', (id) => {
    currentTestingDoc = id
    console.log("Testing Document ID: " + currentTestingDoc)
  })

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
    'visualize',
    'hierarchy',
    'highlight',
    'images',
    'reference_pages',
    'flashcards',
    'profiles',
    'vocabulary',
    'DocStats'
  ]
  socket.emit('types', types)

  for (let type of types) {
    socket.on(type, async (msg) => {
      if(type==='DocStats'){
        const countWords = msg.trim().split(/\s+/).length;
        socket.emit(type, 
          {
            Words:countWords, 
            Tone: utils.calculateSentiment(msg),
            "Reading Level": utils.calculateGradeLevel(msg),
            Sentances: utils.countSentences(msg),
            Time:utils.calculateReadingTime(msg),
            Lines:utils.countLines(msg)
          })
        return
      }
      if (type == 'images') {
        let links = await searchImages(res.text);
        socket.emit(type, links)
        return
      }
      let res = await ask(type, msg)
      // console.log(res)
      socket.emit(type, res)
    })
  }
})

async function ask(type, msg) {
  // let res = await api.sendMessage(msg)
  // saveJson('sample/summary.json', msg)
  let res = getJson(`src/sample/${type}/${currentTestingDoc}.json`)
  console.log(res)
  return res
}

// Search a SINGLE image
async function searchImage(query) {
  const res = await image_search({
    query: query,
    moderate: true,
    iterations: 1,
    retries: 1
  });

  let link = res.slice(0, 1)
  return link[0].thumbnail
}

// Search MULTIPLE images by calling 'searchImage' function recursively 
async function searchImages(queries) {
  let data = JSON.parse(queries)
  let links = []

  for (const word of data.keywords) {
    const link = await searchImage(word)
    links.push(link)
  };

  return links;
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

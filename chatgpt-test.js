import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
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

function getJson(path) {
  return JSON.parse(fs.readFileSync(join(directory, path), 'utf8'))
}

function saveJson(path, json) {
  fs.writeFileSync(join(directory, path), JSON.stringify(json, 'null', 2))
}

const sample = getJson('src/sample/ocr.json')
const rawtext = sample.textAnnotations[0].description
const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
// summary
// "Provide the summary for the followint text: " 

// highlight
// "Extract important words from the followint text with json array: " 

let prompt = "Extract important words from the followint text with json array: " 

let query = prompt + text
let res = await api.sendMessage(query)
saveJson('chatgpt-test.json', res)
console.log(res.text)
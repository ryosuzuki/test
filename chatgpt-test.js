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

console.log(text)

// summary
// "Provide the summary for the following text: " 

// highlight
// "Extract important words from the following text with json array: " 

// hierarchy
// ` create a heirarchy of main points for this text in json format. use suitable variable names for headings. use short phrases instead of sentences. your output should be only code json format. don't print any explanation or text: `

// images
// `give me top 5 words or phrases from this text in a json file. your output should be only code json format. don't print any explanation or text. the json should contain all the results under the variable "keywords": `

// flashcard
// `can you create flashcards for this given text? give output in json and json only without any additional text. json format should be: title of flashcard and its short description as value. don't use sentences; use short phrases everywhere: `

let prompt = `can you create flashcards for this given text? give output in json and json only without any additional text. json format should be: title of flashcard and its short description as value. don't use sentences; use short phrases everywhere: ` 

let query = prompt + text
let res = await api.sendMessage(query)
saveJson('chatgpt-test.json', res)
console.log(res.text)
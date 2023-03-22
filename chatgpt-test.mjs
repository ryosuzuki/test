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

const sample = getJson('src/sample/OCRs/1.json')
const rawtext = sample.textAnnotations[0].description

const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")

console.log(text)

// summary
// "Provide the summary for the following text: " 

// highlight
// "Extract important words from the following text with json array: " 

// table of contents
// ` create a table of contents of main points for this text in json format. use suitable variable names for headings. use short phrases instead of sentences. your output should be only code json format. don't print any explanation or text: `

// images
// `give me top 5 words or phrases from this text in a json file. your output should be only code json format. don't print any explanation or text. the json should contain all the results under the variable "keywords": `

// flashcard
// `can you create flashcards for this given text? give output in json and json only without any additional text. json format should be: title of flashcard and its short description as value. don't use sentences; use short phrases everywhere: `

// Profiles - People/Organization
// `in the following text, extract people/organizations and provide additional but short information about them. Information should be from the text but also from the web (outside the text) to assist me with helpful context, if any. your output should be a json with keys as extracted people or organization name and it's children value as 'info' which will be very short information. add any additional outside information to help with the context. keep children values very short. you can include multiple values for one key. for each key, also add tag value that contains array of multiple tags that associated with the type of key it is. If nothing found, leave json empty. DO NOT include any additional information or explanation or note. Your output should be json and json only:  `

// Vocabulary 
// Given text give me a js object of the form {"Word/phrase": "Meaning or description"} with the top 3 most important or complex words or phrases from the text with their meaning or description. Just give me the object in one line, do not give me any description. Text: 

let prompt = ` create a table of contents for this text in json format. use suitable variable names for headings. use short phrases instead of sentences. your output should be only code json format. don't print any explanation or text: `

let query = prompt + text
let res = await api.sendMessage(query)
saveJson('chatgpt-test.json', res)
console.log(res.text)
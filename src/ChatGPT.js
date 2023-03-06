import React, { Component } from 'react'

const ocrPath = process.env.PUBLIC_URL + '';
let ocr = undefined

class ChatGPT extends Component {
  constructor(props) {
    super(props)
    window.ChatGPT = this
    this.socket = App.socket
    const types = [
      'summary',
      'visualize',
      'hierarchy',
      'highlight',
      'images',
      'reference_pages',
      'flashcards'
    ]
    this.state = {
      types: types
    }
  }

  componentDidMount() {

    // console.log(relativePath);
    // fetch(relativePath)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(error => console.error(error));


    import(`./sample/OCRs/${App.state.testingDoc}.json`)
      .then(module => {
        ocr = module.default; // Get the exported data from the module object
        console.log(ocr); // log the parsed JSON data
      })
      .catch(error => {
        console.error(error); // log any errors
      });


    for (let type of this.state.types) {
      let button = document.querySelector(`#${type}`)
      button.addEventListener('click', () => {
        console.log(type)
        const rawtext = ocr.textAnnotations[0].description
        console.log(rawtext)
        const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
        let query = "I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: " + text;
        this.socket.emit(type, query)
      })

      this.socket.on(type, (res) => {
        switch (type) {
          case 'summary':
            App.setState({ summary: res.text })
            break;
          case 'visualize':
            break;
          case 'hierarchy':
            // console.log(res)
            let data = JSON.parse(res.text)
            let str = ""

            for (const [key, value] of Object.entries(data)) {
              let heading = key.toString().toUpperCase();
              str += `\n● ${heading} : `;
              if (typeof value === 'object') {
                for (const [k, v] of Object.entries(value)) {
                  str += `\n\t\t\t\t\t⚬ ${k}: - ${v}\n`
                }
              }
              else {
                str += ` - ${value} \n`
              }
            }

            console.log(str)
            App.setState({ hierarchy: str })
            break;
          case 'highlight':
            let words = JSON.parse(res.text)
            console.log(words)
            let textAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
              return words.includes(textAnnotation.description)
            })
            console.log(textAnnotations)
            App.setState({ highlight: textAnnotations })
            break;
          case 'images':
            App.setState({ images: res })
            break;
          case 'reference_pages':
            console.log('set active - reference pages')
            App.setState({ showReferencePages: true })
          case 'flashcards':
            let flashcardsjson = JSON.parse(res.text)
            console.log(flashcardsjson)
            App.setState({ flashcards: flashcardsjson })
            break;
        }
      })
    }
  }

  render() {
    return (
      <>
        <div id="buttons">
          {this.state.types.map((type) => {
            return (
              <button id={type}>{type}</button>
            )
          })}
        </div>
      </>
    )
  }
}

export default ChatGPT
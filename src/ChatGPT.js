import React, { Component } from 'react'
import ocr from './sample/ocr.json'

class ChatGPT extends Component {
  constructor(props) {
    super(props)
    window.ChatGPT = this
    this.socket = App.socket
    const types = ['summary', 'visualize', 'highlight']
    this.state = { 
      types: types 
    }
  }

  componentDidMount() {
    for (let type of this.state.types) {
      let button = document.querySelector(`#${type}`)
      button.addEventListener('click', () => {
        console.log(type)
        const rawtext = ocr.textAnnotations[0].description
        const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
        let query = "I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: " + text;
        this.socket.emit(type, query)
      })

      this.socket.on(type, (res) => {
        switch (type) {
          case 'summary':
            App.setState({ summary: res.text })
            break 
          case 'highlight':
            let words = JSON.parse(res.text)
            console.log(words)
            let textAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
              return words.includes(textAnnotation.description)
            })
            console.log(textAnnotations)
            App.setState({ highlight: textAnnotations })
            break 
        }
      })
    }
  }

  render() {
    return (
      <>
        <div id="buttons">
          { this.state.types.map((type) => {
            return (
              <button id={ type }>{ type }</button>
            )
          })}
        </div>
      </>
    )
  }
}

export default ChatGPT
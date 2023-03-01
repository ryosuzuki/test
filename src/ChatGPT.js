import React, { Component } from 'react'
import sample from './sample/ocr.json'

class ChatGPT extends Component {
  constructor(props) {
    super(props)
    this.socket = App.socket
  }

  componentDidMount() {
    let types = ['summary', 'visualize']

    for (let type of types) {
      let button = document.querySelector(`#${type}`)
      button.addEventListener('click', () => {
        console.log(type)
        const rawtext = sample.textAnnotations[0].description
        const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
        let query = "I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: " + text;
        this.socket.emit(type, query)
      })

      this.socket.on(type, (res) => {
        console.log(type)
        console.log(res)
        switch (type) {
          case 'summary':
            this.showSummary(res)
            break
          case 'visualize':
            this.showVisualize(res)
            break
        }
      })
    }
  }

  showSummary(res) {
    let summaryEl = document.querySelector('#summary-res')
    summaryEl.textContent = res.text
  }

  showVisualize(res) {
    let visualizeEl = document.querySelector('#visualize-res')
    visualizeEl.textContent = res.text
  }

  render() {
    return (
      <>
        <div id="buttons">
          <button id="summary">Summary</button>
          <button id="visualize">Visualize</button>
        </div>
      </>
    )
  }


}

export default ChatGPT
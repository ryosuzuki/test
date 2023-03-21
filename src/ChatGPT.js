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
      // 'visualize',
      'hierarchy',
      // 'highlight',
      // 'images',
      // 'reference_pages',
      // 'flashcards',
      // 'profiles',
      'vocabulary',
      // 'DocStats'
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


    import(`./sample/OCRs/${App.state.currentTestingDoc}.json`)
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
        // console.log(type)
        const rawtext = ocr.textAnnotations[0].description
        // console.log(rawtext)
        const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
        let query = `I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: ${rawtext}`;
        this.socket.emit(type, query)
      })

      this.socket.on(type, (res) => {
        switch (type) {
          case 'summary':
            makeAllStatesNull()
            App.setState({ summary: res.text })
            break;
          case 'DocStats':
            console.log(res);
            makeAllStatesNull()
            App.setState({ doc_stats: res });
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

            // console.log(str);
            makeAllStatesNull()
            App.setState({ hierarchy: str })
            break;
          case 'highlight':
            let words = JSON.parse(res.text)
            console.log(words)
            let textAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
              return words.includes(textAnnotation.description)
            })
            console.log(textAnnotations)
            makeAllStatesNull()
            App.setState({ highlight: textAnnotations })
            break;
          case 'images':
            makeAllStatesNull()
            App.setState({ images: res })
            break;
          case 'reference_pages':
            console.log('set active - reference pages')
            makeAllStatesNull()
            App.setState({ showReferencePages: true })
          case 'flashcards':
            let flashcardsjson = JSON.parse(res.text)
            console.log(flashcardsjson)
            makeAllStatesNull()
            App.setState({ flashcards: flashcardsjson })
            break;
          case 'profiles':
            let profileData = JSON.parse(res.text)
            console.log(profileData)
            makeAllStatesNull()
            App.setState({ profile: profileData })
            break;
          case 'vocabulary':
            console.log(ocr.textAnnotations[0].description)
            let vocabs = JSON.parse(res.text);
            console.log(vocabs);
            let wordsArr = [];
            ocr.textAnnotations.forEach((item) => {
              wordsArr.push(item.description)
            });
            let matches = checkConsecutiveWords(vocabs, wordsArr);
            // console.log(matches);

            let finalMatches = [];
            matches.matches.forEach((item) => {
              let tempObj = (ocr.textAnnotations[item.index]);
              tempObj['meaning'] = item.value;
              finalMatches.push(tempObj);
              let wordLength = item.key.split(' ').length;
              for (let i = 1; i < wordLength; i++) {
                let obj = (ocr.textAnnotations[item.index + i]);
                obj['meaning'] = item.value;
                finalMatches.push(obj)
              }
            })
            // console.log(finalMatches)

            let thetextAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
              return textAnnotation.description in vocabs
            });
            thetextAnnotations.map((item) => {
              return item['meaning'] = vocabs[item.description]
            });
            finalMatches = Object.values(finalMatches.reduce((acc, obj) => {
              acc[obj['description']] = obj;
              return acc;
            }, {}));
            thetextAnnotations = Object.values(thetextAnnotations.reduce((acc, obj) => {
              acc[obj['description']] = obj;
              return acc;
            }, {}));
            thetextAnnotations = thetextAnnotations.concat(finalMatches)
            // console.log(thetextAnnotations)
            makeAllStatesNull()
            App.setState({ vocabulary: thetextAnnotations })
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

export default ChatGPT;

function checkConsecutiveWords(json, words) {
  const matches = [];
  const matchesIndex = []
  for (let i = 0; i < words.length - 1; i++) {
    let phrase = words[i];
    for (let j = i + 1; j < i + 6; j++) {
      phrase += ' ' + words[j];
      if (json.hasOwnProperty(phrase)) {
        matchesIndex.push(i)
        matches.push({
          key: phrase,
          value: json[phrase],
          index: i
        });
      }
    }
  }
  return { matches };
}

function makeAllStatesNull() {
  let states = [
    { state: 'summary', type: 'string' },
    { state: 'hierarchy', type: 'string' },
    { state: 'highlight', type: 'array' },
    { state: 'images', type: 'array' },
    { state: 'flashcards', type: 'array' },
    { state: 'profile', type: 'string' },
    { state: 'showReferencePages', type: 'bool' },
    { state: 'doc_stats', type: 'null' },
    { state: 'vocabulary', type: 'array' },
  ]
  states.forEach((item) => {
    if (item.type === 'string') {
      App.setState({ [item.state]: '' }, () => {
        console.log(App.state)
      })
    } else if (item.type === 'array') {
      App.setState({ [item.state]: [] }, () => {
        console.log(App.state)
      })
    } else if (item.type === 'bool') {
      App.setState({ [item.state]: false }, () => {
        console.log(App.state)
      })
    } else {
      App.setState({ [item.state]: null }, () => {
        console.log(App.state)
      })
    }
  })
  console.log(App.state)
}
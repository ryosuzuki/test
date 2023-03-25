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
      'people',
      'image',
      'map',
      'timeline',
      'matrix',
      'keywords'
    ]
    this.state = {
      types: types
    }
  }

  componentDidMount() {
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
        console.log(rawtext)
        const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
        let query = `I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: ${rawtext}`;
        if (type === 'people') {
          query = 'DJI Phantom'
        }
        if (type === 'image') {
          query = 'algebra'
        }
        if (type === 'map') {
          query = 'Yosemite'
        }
        this.socket.emit(type, query)
      })

      this.socket.on(type, (res) => {
        switch (type) {
          case 'summary':
            makeAllStatesNull()
            App.setState({ summary: res.text })
            break;

          case 'image':
            // getInfoFromDuckDUckGO(res.text).then((resp)=>{
            let imgjsn = `{\"${res.text}\": \"'image\"}`;

            dummyPomise().then(() => {
              let vocabs = JSON.parse(imgjsn);
              console.log(vocabs);
              let wordsArr = [];
              ocr.textAnnotations.forEach((item) => {
                wordsArr.push(item.description)
              });
              let matches = checkConsecutiveWords(vocabs, wordsArr);
              console.log(matches);

              let finalMatches = [];
              matches.matches.forEach((item) => {
                let tempObj = (ocr.textAnnotations[item.index]);
                tempObj['imageURL'] = res.image;
                tempObj['title'] = res.text;
                finalMatches.push(tempObj);
                let wordLength = item.key.split(' ').length;
                for (let i = 1; i < wordLength; i++) {
                  let obj = (ocr.textAnnotations[item.index + i]);
                  obj['imageURL'] = res.image
                  obj['title'] = res.text
                  finalMatches.push(obj)
                }
              })

              let thetextAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
                return textAnnotation.description in vocabs
              });
              console.log(res.image)
              thetextAnnotations.map((item) => {
                return item['imageURL'] = res.image
              });
              thetextAnnotations.map((item) => {
                return item['title'] = res.text
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
              console.log(thetextAnnotations)
              makeAllStatesNull()
              App.setState({ image: thetextAnnotations })
            })
            break;

          case 'map':
            console.log(res)
            // getInfoFromDuckDUckGO(res.text).then((resp)=>{
            let mapobj = { image: res.image, title: res.text }
            let mapjsn = `{\"${res}\": \"'map\"}`;

            getMapImage(res).then((url) => {
              console.log(url)
              let name = res
              res = {
                image: url,
                text: name
              }
              let vocabs = JSON.parse(mapjsn);
              console.log(vocabs);
              let wordsArr = [];
              ocr.textAnnotations.forEach((item) => {
                wordsArr.push(item.description)
              });
              let matches = checkConsecutiveWords(vocabs, wordsArr);
              console.log(matches);

              let finalMatches = [];
              matches.matches.forEach((item) => {
                let tempObj = (ocr.textAnnotations[item.index]);
                tempObj['imageURL'] = res.image;
                tempObj['title'] = res.text;
                finalMatches.push(tempObj);
                let wordLength = item.key.split(' ').length;
                for (let i = 1; i < wordLength; i++) {
                  let obj = (ocr.textAnnotations[item.index + i]);
                  obj['imageURL'] = res.image
                  obj['title'] = res.text
                  finalMatches.push(obj)
                }
              })

              let thetextAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
                return textAnnotation.description in vocabs
              });
              console.log(res.image, res)
              thetextAnnotations.map((item) => {
                return item['imageURL'] = res.image
              });
              thetextAnnotations.map((item) => {
                return item['title'] = res.text
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
              console.log(thetextAnnotations)
              makeAllStatesNull()
              App.setState({ image: thetextAnnotations })
            })
            break;

          case 'people':
            let obj = { image: res.image, desc: res.resp.Abstract, title: res.text }
            console.log(obj);
            let jsn = `{\"${res.text}\": \"${obj.desc}\"}`;

            dummyPomise().then(() => {
              let vocabs = JSON.parse(jsn);
              console.log(vocabs);
              let wordsArr = [];
              ocr.textAnnotations.forEach((item) => {
                wordsArr.push(item.description)
              });
              let matches = checkConsecutiveWords(vocabs, wordsArr);
              console.log(matches);

              let finalMatches = [];
              matches.matches.forEach((item) => {
                let tempObj = (ocr.textAnnotations[item.index]);
                tempObj['meaning'] = item.value;
                tempObj['imageURL'] = res.image;
                tempObj['title'] = res.text;
                finalMatches.push(tempObj);
                let wordLength = item.key.split(' ').length;
                for (let i = 1; i < wordLength; i++) {
                  let obj = (ocr.textAnnotations[item.index + i]);
                  obj['meaning'] = item.value;
                  obj['imageURL'] = res.image
                  obj['title'] = res.text
                  finalMatches.push(obj)
                }
              })
              // console.log(finalMatches)

              let thetextAnnotations = ocr.textAnnotations.filter((textAnnotation) => {
                return textAnnotation.description in vocabs
              });
              thetextAnnotations.map((item) => {
                console.log(item)
                return item['meaning'] = vocabs[item.description];
              });
              thetextAnnotations.map((item) => {
                return item['imageURL'] = res.image
              });
              thetextAnnotations.map((item) => {
                return item['title'] = res.text
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
              console.log(thetextAnnotations)
              makeAllStatesNull()
              App.setState({ people: thetextAnnotations })
            })
            break;

          case 'timeline':
            makeAllStatesNull()
            console.log(res)
            App.setState({ timeline: res})
            break;
          case 'matrix':
            // makeAllStatesNull()s
            console.log(res)
            let matrixjson = res
            App.setState({ matrix: matrixjson})
            console.log(matrixjson)
            break;
          case 'keywords':
            App.setState({ keywords: res})
        }
      })
    }
  }

  render() {
    return (
      <>
        <div id="buttons">
          {this.state.types.map((type) => {
            let name = type;
            return (
              <button id={type}>{name}</button>
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
      if (searchJsonForPhrase(json, phrase)) {
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
    { state: 'people', type: 'array' },
    { state: 'image', type: 'array' },
    { state: 'timeline', type: 'string' },
    { state: 'matrix', type: 'obj' },
  ]
  states.forEach((item) => {
    if (item.type === 'string') {
      App.setState({ [item.state]: '' }, () => {
        // console.log(App.state)
      })
    } else if (item.type === 'array') {
      App.setState({ [item.state]: [] }, () => {
        // console.log(App.state)
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

function searchJsonForPhrase(json, phrase) {
  const data = json
  for (const key in data) {
    const value = data[key];
    if (key.toLowerCase().includes(phrase.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function getInfoFromDuckDUckGO(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(`Error fetching JSON: ${error}`);
    });
}


function dummyPomise() {
  return new Promise((resolve, reject) => {
    resolve('')
  })
}

function getCoordinates(place, accessToken = 'pk.eyJ1IjoiYWRpZ3VudHVydSIsImEiOiJja3pocmk5aG8xeW9hMzRvNnZobG43aXowIn0.kJ9gIRBoOAqS8jvtZKWHnA') {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${accessToken}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    });
}

function getMapImage(place, accessToken = 'pk.eyJ1IjoiYWRpZ3VudHVydSIsImEiOiJja3pocmk5aG8xeW9hMzRvNnZobG43aXowIn0.kJ9gIRBoOAqS8jvtZKWHnA') {
  return new Promise((resolve, reject) => {
    console.log(place)
    getCoordinates(place).then((res) => {
      const width = 200;
      const height = 150;
      const zoom = 8;
      const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${res.longitude},${res.latitude},${zoom}/${width}x${height}?access_token=${accessToken}`;
      resolve(url)
    })
  })
}
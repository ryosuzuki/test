import React, { Component } from 'react'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const inputVideo = document.getElementById('input_video')
    console.log(inputVideo)

    let temp = this
    navigator.mediaDevices
    .getUserMedia({
      video: true, audio: false,
    })
    .then(async function (stream) {
      inputVideo.srcObject = stream
      inputVideo.play()
      // schedule the first one.
      // setTimeout(processVideo, 0)
      temp.cap = new cv.VideoCapture(inputVideo)
      temp.processing()
    })
    .catch(function (err) {
      console.log("An error occurred! " + err)
    })
  }

  processing() {
    console.log('hello')
    const FPS = 10
    let begin = Date.now()
    console.log(this.cap)
    try {
      let src = new cv.Mat(720, 1280, cv.CV_8UC4)
      let dst = new cv.Mat(720, 1280, cv.CV_8UC4)
      this.cap.read(src)

      let gray = new cv.Mat(720, 1280, cv.CV_8UC4)
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)

      let outputCanvas = document.getElementById("canvasOutput");
      console.log(gray)
      
      cv.imshow(outputCanvas, gray)
      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    } catch (err) {
      console.error(err);
      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)      
    }
  }

  render() {
    return (
      <>
        <p>Hello World</p>
      </>
    )
  }

}

export default Video
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
      let srcMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      let dstMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      this.cap.read(srcMat)

      let grayMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY)

      let edgesMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      cv.Canny(grayMat, edgesMat, 50, 200, 3, false)

      let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3))
      cv.dilate(edgesMat, edgesMat, kernel)
      cv.erode(edgesMat, edgesMat, kernel)

      let outputCanvas = document.getElementById("canvasOutput")
      cv.imshow(outputCanvas, edgesMat)

      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    } catch (err) {
      console.error(err)
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
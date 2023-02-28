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

  /*
  startLoop() {
    console.log('hello')
    const FPS = 10
    let begin = Date.now()
    console.log(this.cap)
    try {

      let delay = 1000 / FPS - (Date.now() - begin)
      console.log(delay)
      setTimeout(this.processing.bind(this), delay)
    } catch (err) {
      console.error(err)
      let delay = 1000 / FPS - (Date.now() - begin)
      console.log(delay)
      setTimeout(this.processing.bind(this), delay)
    }
  }
  */

  processing() {
    const FPS = 1
    let begin = Date.now()
    try {
      let srcMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      this.cap.read(srcMat)

      let tempMat = new cv.Mat(720, 1280, cv.CV_8UC4)
      cv.cvtColor(srcMat, tempMat, cv.COLOR_RGBA2GRAY)
      cv.GaussianBlur(tempMat, tempMat, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT)
      cv.adaptiveThreshold(tempMat, tempMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)
      let contours = new cv.MatVector()
      let hierarchy = new cv.Mat()
      cv.findContours(tempMat, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)

      let maxArea = 0
      let maxContour = null

      for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i)
        let area = cv.contourArea(contour)

        if (area > maxArea) {
          maxArea = area
          maxContour = contour
        }
      }

      let epsilon = 0.1 * cv.arcLength(maxContour, true)
      let approx = new cv.Mat()
      cv.approxPolyDP(maxContour, approx, epsilon, true)

      console.log(approx.rows)
      if (approx.rows === 4) {
        let approxVec = new cv.MatVector();
        approxVec.push_back(approx);
        cv.polylines(srcMat, approxVec, true, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA, 0);
        // cv.polylines(srcMat, [approx], true, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA, 0)

        // let warped = cv.warpImage(srcMat, approxVec.get(0))
        // let sortedApproxVec = sortPointsClockwise(approxVec)
        const roiMat = new cv.Mat(4, 1, cv.CV_32FC2)
        roiMat.data32F = approxVec.get(0).flat()
        let dstPoints = [0, 0, 800, 0, 800, 800, 0, 800]
        let M = cv.getPerspectiveTransform(roiMat, dstPoints)
        // let dstMat = new cv.Mat(800, 800, cv.CV_8UC4)
        // cv.warpPerspective(srcMat, dstMat, M, dstMat.size(), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())
        // let outputCanvas2 = document.getElementById("canvasOutput2")
        // cv.imshow(outputCanvas2, dstMat)
      }

      let outputCanvas = document.getElementById("canvasOutput")
      cv.imshow(outputCanvas, srcMat)

      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    } catch (err) {
      console.error(err)
      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    }
  }

  processing2() {
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
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

      let approx = this.getApprox(contours, tempMat.cols, tempMat.rows)

      // for (let i = 0; i < contours.size(); i++) {
      //   let contour = contours.get(i)
      //   let area = cv.contourArea(contour)

      //   if (area > maxArea) {
      //     maxArea = area
      //     maxContour = contour
      //   }
      // }

      // let epsilon = 0.1 * cv.arcLength(maxContour, true)
      // let approx = new cv.Mat()
      // cv.approxPolyDP(maxContour, approx, epsilon, true)

      console.log(approx.rows)
      if (approx.rows === 4) {
        let approxVec = new cv.MatVector()
        approxVec.push_back(approx)
        cv.polylines(srcMat, approxVec, true, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA, 0)

        let [srcPoints, dstPoints, dSize] = this.rectify(approx)
        console.log(dSize)
        let M = cv.getPerspectiveTransform(srcPoints, dstPoints)
        let dstMat = new cv.Mat(850, 1100, cv.CV_8UC4)
        cv.warpPerspective(srcMat, dstMat, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())
        let outputCanvas2 = document.getElementById("canvasOutput2")
        cv.imshow(outputCanvas2, dstMat)
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


  getApprox(contours, width, height) {
    // for (let i = 0; i < contours.size(); i++) {
    //   let contour = contours.get(i)
    //   let area = cv.contourArea(contour)

    //   if (area > maxArea) {
    //     maxArea = area
    //     maxContour = contour
    //   }
    // }

    // let epsilon = 0.1 * cv.arcLength(maxContour, true)
    // let approx = new cv.Mat()
    // cv.approxPolyDP(maxContour, approx, epsilon, true)

    const sorted = new Array();
    for (let i = 0; i < contours.size(); i++) {
      const arcLength = cv.arcLength(contours.get(i), true);
      sorted.push({
        arcLength,
        element: contours.get(i)
      });
    }
    sorted.sort((a, b) => (a.arcLength < b.arcLength) ? 1 : ((b.arcLength < a.arcLength) ? -1 : 0));
    const imagePerimeter = 2 * (width + height);
    for (let i = 0; i < contours.size(); i++) {
      if (sorted[i].arcLength >= imagePerimeter) continue;
      let approx = new cv.Mat();
      cv.approxPolyDP(sorted[i].element, approx, (0.02 * sorted[i].arcLength), true);
      if (approx.size().height == 4) return approx;
    }
    return null
  }

  rectify(target) {
    const vertex = new Array()
    vertex.push(new cv.Point(target.data32S[0 * 4], target.data32S[0 * 4 + 1]))
    vertex.push(new cv.Point(target.data32S[0 * 4 + 2], target.data32S[0 * 4 + 3]))
    vertex.push(new cv.Point(target.data32S[1 * 4], target.data32S[1 * 4 + 1]))
    vertex.push(new cv.Point(target.data32S[1 * 4 + 2], target.data32S[1 * 4 + 3]))

    let xMin = vertex[0].x, yMin = vertex[0].y, xMax = vertex[0].x, yMax = vertex[0].y
    for (let i = 1; i < vertex.length; i++) {
      if (vertex[i].x < xMin) xMin = vertex[i].x
      if (vertex[i].x > xMax) xMax = vertex[i].x
      if (vertex[i].y < yMin) yMin = vertex[i].y
      if (vertex[i].y > yMax) yMax = vertex[i].y
    }
    const height = Math.floor(Math.abs(xMax - xMin)) // width
    const width = Math.floor(Math.abs(yMax - yMin))  // height

    let nWest, nEast, sEast, sWest
    vertex.sort((a, b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0))
    if (vertex[0].y < vertex[1].y) {
      nWest = vertex[0]
      sWest = vertex[1]
    } else {
      nWest = vertex[1]
      sWest = vertex[0]
    }
    if (vertex[2].y > vertex[3].y) {
      sEast = vertex[2]
      nEast = vertex[3]
    } else {
      sEast = vertex[3]
      nEast = vertex[2]
    }

    const src = [nWest.x, nWest.y, nEast.x, nEast.y, sEast.x, sEast.y, sWest.x, sWest.y]
    const dst = [0, 0, width, 0, width, height, 0, height]

    const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, src)
    const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, dst)
    const dSize = new cv.Size(width, height)

    return [srcPoints, dstPoints, dSize]
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
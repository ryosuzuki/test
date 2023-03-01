import React, { Component } from 'react'
import sample from './sample/ocr.json'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    window.sample = sample 
    window.Video = this
    const sceneEl = document.querySelector('a-scene')
    const intervalId = setInterval(() => {
      this.inputVideo = sceneEl.systems['mindar-image-system'].video
      if (this.inputVideo.readyState >= this.inputVideo.HAVE_METADATA) {
        console.log('MindAR video is now available!')
        this.cap = new cv.VideoCapture(this.inputVideo)
        this.getDocument()
        clearInterval(intervalId) 
      }
    }, 1000) // Check every 1 second until ready
  }

  getDocument() {
    let width = this.inputVideo.width
    let height = this.inputVideo.height
    let srcMat = new cv.Mat(height, width, cv.CV_8UC4)
    this.cap.read(srcMat)
    let tempMat = new cv.Mat(height, width, cv.CV_8UC4)
    cv.cvtColor(srcMat, tempMat, cv.COLOR_RGBA2GRAY)
    cv.GaussianBlur(tempMat, tempMat, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT)
    cv.adaptiveThreshold(tempMat, tempMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)
    cv.Canny(tempMat, tempMat, 0, 50);
    let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3))
    cv.dilate(tempMat, tempMat, kernel)
    cv.erode(tempMat, tempMat, kernel)

    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.findContours(tempMat, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)

    let approx = this.getApprox(contours, tempMat.cols, tempMat.rows)
    let [points, srcPoints, dstPoints, dSize] = this.rectify(approx)
    let M = cv.getPerspectiveTransform(srcPoints, dstPoints)
    let dstMat = new cv.Mat(850, 1100, cv.CV_8UC4)
    cv.warpPerspective(srcMat, dstMat, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())
    let outputCanvas2 = document.getElementById("canvasOutput2")
    cv.imshow(outputCanvas2, dstMat)

    let approxVec = new cv.MatVector();
    approxVec.push_back(approx);
    cv.polylines(tempMat, approxVec, true, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA, 0);

    let outputCanvas = document.getElementById("canvasOutput")
    outputCanvas.width = this.inputVideo.width
    outputCanvas.height = this.inputVideo.height
    cv.imshow(outputCanvas, tempMat)

  }


  processing() {
    const FPS = 1
    let begin = Date.now()
    try {
      let width = this.inputVideo.width
      let height = this.inputVideo.height
      let srcMat = new cv.Mat(height, width, cv.CV_8UC4)
      this.cap.read(srcMat)

      let tempMat = new cv.Mat(height, width, cv.CV_8UC4)
      cv.cvtColor(srcMat, tempMat, cv.COLOR_RGBA2GRAY)
      cv.GaussianBlur(tempMat, tempMat, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT)
      cv.adaptiveThreshold(tempMat, tempMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)
      let contours = new cv.MatVector()
      let hierarchy = new cv.Mat()
      cv.findContours(tempMat, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
      let approx = this.getApprox(contours, tempMat.cols, tempMat.rows)

      console.log(approx.rows)
      let approxVec = new cv.MatVector()
      approxVec.push_back(approx)
      cv.polylines(srcMat, approxVec, true, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA, 0)

      let [points, srcPoints, dstPoints, dSize] = this.rectify(approx)
      let M = cv.getPerspectiveTransform(srcPoints, dstPoints)
      let dstMat = new cv.Mat(850, 1100, cv.CV_8UC4)
      cv.warpPerspective(srcMat, dstMat, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())
      let outputCanvas2 = document.getElementById("canvasOutput2")
      cv.imshow(outputCanvas2, dstMat)

      // const canvas = document.getElementById('canvasOutput3');
      // const ctx = canvas.getContext('2d');
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      let homography = cv.findHomography(srcPoints, dstPoints)
      let invHomography = new cv.Mat()
      cv.invert(homography, invHomography)

      let w = dSize.width  / 1660
      let h = dSize.height / 2149

      let labels = window.sample.textAnnotations
      for (let i = 0 ; i < labels.length; i++) {
        let label = labels[i]
        let vertices = label.boundingPoly.vertices
        let matData = []
        for (let j = 0; j < vertices.length; j++) {
          let vertex = vertices[j]
          matData.push(vertex.x * w)
          matData.push(vertex.y * h)
        }
        // console.log(matData)
        let srcCorners = new cv.Mat(4, 1, cv.CV_32FC2)
        srcCorners.data32F.set(matData)
        let dstCoordinates = new cv.Mat()
        cv.perspectiveTransform(srcCorners, dstCoordinates, invHomography)

        let array = [dstCoordinates.data32F[0], dstCoordinates.data32F[1], dstCoordinates.data32F[2], dstCoordinates.data32F[3], dstCoordinates.data32F[4], dstCoordinates.data32F[5], dstCoordinates.data32F[6], dstCoordinates.data32F[7]]
        window.array = array
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        randomColor = 'ff00ff'
        if (i > 1) {
          // this.drawRect(array, `#${randomColor}`)
        }
      }
      let outputCanvas = document.getElementById("canvasOutput")
      outputCanvas.width = this.inputVideo.width
      outputCanvas.height = this.inputVideo.height
      for (const prop of Object.keys(this.inputVideo.style)) {
        outputCanvas.style[prop] = this.inputVideo.style[prop]
      }
      cv.imshow(outputCanvas, srcMat)

      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    } catch (err) {
      console.error(err)
      let delay = 1000 / FPS - (Date.now() - begin)
      setTimeout(this.processing.bind(this), delay)
    }
  }

  drawRect(points, color='green') {
    const canvas = document.getElementById('canvasOutput3');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0], points[1])
    ctx.lineTo(points[2], points[3])
    ctx.lineTo(points[4], points[5])
    ctx.lineTo(points[6], points[7])
    ctx.closePath()
    ctx.fill();
    ctx.stroke();
  }

  getApprox(contours, width, height) {
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

    return [src, srcPoints, dstPoints, dSize]
  }


  render() {
    return (
      <>
        <div id="opencv">
          <canvas id="canvasOutput"></canvas>
          <canvas id="canvasOutput2" width="850" height="1100"></canvas>
          <canvas id="canvasOutput3" width="1280" height="720"></canvas>
        </div>
      </>
    )
  }

}

export default Video
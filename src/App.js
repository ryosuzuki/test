import React, { Component } from 'react'
import './App.css'
import Video from './Video.js'
import { io } from 'socket.io-client'
import sample from './sample.json'
import 'aframe-htmlembed-component'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

    if (window.location.href.includes('localhost')) {
      this.socket = io('http://localhost:4000')
    }
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

  init() {
  }

  mouseDown(event) {
    if (!window.calibrated) return false
    this.setState({ dragging: true })
  }

  mouseMove(event) {
    if (!window.calibrated) return false
    let mouse2D = { x: event.clientX, y: event.clientY }
    this.setState({ mouse2D: mouse2D })
  }

  mouseUp(event) {
    if (!window.calibrated) return false
    this.setState({ dragging: false, initDrawing: true })
    this.canvas.mouseUp(this.state.mouse)
  }

  touchStart(event) {
    if (!window.calibrated) return false
    this.setState({ dragging: true, mouse2D: { x: 0, y: 0 } })
  }

  touchMove(event) {
    if (!window.calibrated) return false
    let mouse2D = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    this.setState({ mouse2D: mouse2D })
  }

  touchEnd(event) {
    if (!window.calibrated) return false
    this.setState({ dragging: false, initDrawing: true })
    this.canvas.mouseUp()
  }

  update() {
    if (!window.calibrated) return
    this.mesh.material.map.needsUpdate = true
    if (this.state.dragging) {
      const screenPositionX = this.state.mouse2D.x / window.innerWidth * 2 - 1
      const screenPositionY = this.state.mouse2D.y / window.innerHeight * 2 - 1
      const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

      let camera = document.getElementById('camera')
      let threeCamera = camera.getObject3D('camera')
      this.state.raycaster.setFromCamera(screenPosition, threeCamera)
      const intersects = this.state.raycaster.intersectObject(this.mesh, true)
      if (intersects.length > 0) {
        const intersect = intersects[0]
        let point = intersect.point
        let mouse = {
          x: this.size * intersect.uv.x,
          y: this.size * (1- intersect.uv.y)
        }
        this.setState({ distance: intersect.distance, mouse: mouse })
        if (this.state.initDrawing) {
          this.canvas.mouseDown(mouse)
          this.setState({ initDrawing: false })
        } else {
          this.canvas.mouseMove(mouse)
        }
      }
    }
  }


  render() {
    return (
      <>
        <a-scene
          mindar-image="imageTargetSrc: http://localhost:4000/public/target.mind"
          embedded color-space="sRGB"
          renderer="colorManagement: true, physicallyCorrectLights"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
            <a-entity id="transcript" className="htmlembed" htmlembed="ppu:225" position="0 0 0">
              <div id="html-canvas">
                {/*<img src="http://localhost:4000/public/viz.png" />*/}
                <div id="summary-res" style={{ position: 'absolute', top: 0, left: 0 }}></div>
                <div id="visualize-res" style={{ position: 'absolute', top: 300, left: 0 }}></div>
               </div>
            </a-entity>
            {/*
            <a-entity htmlembed="src: https://google.com"></a-entity>
            <a-image src="http://localhost:4000/public/viz.png" position="0 1 0" height="0.552" width="1" rotation="0 0 0"></a-image>
            <a-image src="http://localhost:4000/public/annotation-1.png" position="-0.8 0 0" height="0.552" width="1" rotation="0 0 0"></a-image>
            <a-image src="http://localhost:4000/public/annotation-2.png" position="0.8 -0.5 0" height="0.552" width="1"></a-image>
            <a-plane position="0 0 0" width="1" height="0.5" color="#ccc"></a-plane>
            */}
          </a-entity>
        </a-scene>
        <div id="buttons">
          <button id="summary">Summary</button>
          <button id="visualize">Visualize</button>
        </div>
        <Video />
      </>
    )
  }


}

export default App
import React, { Component } from 'react'
import './App.css'
import Video from './Video.js'
import Canvas from './Canvas.js'
import ChatGPT from './ChatGPT.js'
import { io } from 'socket.io-client'

AFRAME.registerComponent('drawing-plane', {
  init: () => {},
  tick: () => {}
})

const isCameraOn = false 

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

    if (window.location.href.includes('localhost')) {
      this.socket = io('http://localhost:4000')
    }

    this.size = 1024
    this.state = {
      summary: '',
      hierarchy: '',
      highlight: [],
      images: [],

      showReferencePages: false,
      dragging: false,
      initDrawing: true,
      distance: 0,
      mouse2D: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
    }
    this.strokeColor = '#002f2b'
    this.fillColor = '#004842'
    this.fillColorAlpha = 'rgba(0, 28, 26, 0.4)'
    this.strokeWidth = 8    
  }

  componentDidMount() {
    this.canvas = window.Canvas

    this.sceneEl = document.querySelector('a-scene')
    this.sceneEl.addEventListener('loaded', () => {
      this.init()
      // AFRAME.components['drawing-plane'].Component.prototype.init = this.init.bind(this)
      AFRAME.components['drawing-plane'].Component.prototype.tick = this.tick.bind(this)
    })

  }

  // showSummary(res) {
  //   let summaryEl = document.querySelector('#summary-res')
  //   summaryEl.textContent = res.text
  // }

  // showHierarchy(res){
  //   let hierarchyEl = document.querySelector('#hierarchy-res')
  //   hierarchyEl.text = res.text
  // }

  // showVisualize(res) {
  //   let visualizeEl = document.querySelector('#visualize-res')
  //   visualizeEl.textContent = res.text
  // }

  init() {
    console.log('init')
    let el = document.querySelector('#drawing-plane')
    let mesh = el.object3D.children[0]
    let konvaEl = document.querySelector('.konvajs-content canvas')
    // konvaEl.width = konvaEl.height = this.size
    console.log(konvaEl)
    let texture = new THREE.Texture(konvaEl)
    let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    mesh.material = material
    // mesh.material.transparent = true
    this.mesh = mesh
    el.sceneEl.addEventListener('mousedown', this.mouseDown.bind(this))
    el.sceneEl.addEventListener('mousemove', this.mouseMove.bind(this))
    el.sceneEl.addEventListener('mouseup', this.mouseUp.bind(this))
    el.sceneEl.addEventListener('touchstart', this.touchStart.bind(this))
    el.sceneEl.addEventListener('touchmove', this.touchMove.bind(this))
    el.sceneEl.addEventListener('touchend', this.touchEnd.bind(this))
  }

  mouseDown(event) {
    this.setState({ dragging: true })
  }

  mouseMove(event) {
    let mouse2D = { x: event.clientX, y: event.clientY }
    this.setState({ mouse2D: mouse2D })
  }

  mouseUp(event) {
    this.setState({ dragging: false, initDrawing: true })
    this.canvas.mouseUp(this.state.mouse)
  }

  touchStart(event) {
    this.setState({ dragging: true, mouse2D: { x: 0, y: 0 } })
  }

  touchMove(event) {
    let mouse2D = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    this.setState({ mouse2D: mouse2D })
  }

  touchEnd(event) {
    this.setState({ dragging: false, initDrawing: true })
    this.canvas.mouseUp()
  }

  tick() {
    console.log('tick')
    this.mesh.material.map.needsUpdate = true
    return
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
        <Canvas />
        { isCameraOn ? '' :
          <a-scene>
            <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 1.5 -1" width="1" height="1"></a-plane>        
          </a-scene>          
        }
        { !isCameraOn ? '' :
          <a-scene
            mindar-image="imageTargetSrc: http://localhost:4000/public/target.mind"
            embedded color-space="sRGB"
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
            <a-entity mindar-image-target="targetIndex: 0">
              <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 0 0"></a-plane>
            </a-entity>
            <Video />
          </a-scene>
        } 
        <ChatGPT />
      </>
    )
  }


}

export default App
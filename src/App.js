import React, { Component } from 'react'
import './App.css'
import Video from './Video.js'
import Canvas from './Canvas'
import ChatGPT from './ChatGPT.js'
import SpeechLayer from './SpeechLayer'
import { io } from 'socket.io-client'

AFRAME.registerComponent('drawing-plane', {
  init: () => { },
  tick: () => { }
})

const isCameraOn = false

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

    // Update your https://IP:PORT here
    // this.socket = io('https://IP:PORT')
    this.socket = io('https://localhost:4000')

    this.size = 1024
    this.state = {
      summary: '',
      currentTestingDoc: 2, //change for doc & vis that you want to test
      dragging: false,
      initDrawing: true,
      distance: 0,
      mouse2D: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
      people: [],
      image: [],
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

    console.log(this.state.currentTestingDoc)
    this.socket.emit('currentTestingDoc', this.state.currentTestingDoc)
  }

  init() {
    console.log('init')
    let el = document.querySelector('#drawing-plane')
    let mesh = el.object3D.children[0]
    let konvaEl = document.querySelector('.konvajs-content canvas');
    // konvaEl.width = konvaEl.height = this.size
    console.log(konvaEl)
    let texture = new THREE.Texture(konvaEl)
    let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    mesh.material = material
    // mesh.material.transparent = true
    this.mesh = mesh
  }
    
  tick() {
    // console.log('tick')
    this.mesh.material.map.needsUpdate = true
    return
  }
    
  render() {
    // Update your https://IP:PORT here
    let target = `imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.0.0/examples/image-tracking/assets/card-example/card.mind`
    return (
      <>


        <Canvas 
        size={this.size}
        state={this.state}
        debug={isCameraOn}
        space={1024}
        socket={this.socket} 
        currentTestingDoc={this.state.currentTestingDoc}
        />


        {isCameraOn ? '' :
          <a-scene>
            <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 1.5 -1" width="1.6" height="1.6"></a-plane>
          </a-scene>
        }
        {!isCameraOn ? '' :
          <a-scene
            mindar-image={target}
            embedded color-space="sRGB"
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
            <a-entity mindar-image-target="targetIndex: 0">
              <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 0 0" height="2" width="2"></a-plane>
            </a-entity>
            <Video />
          </a-scene>
        }
        <ChatGPT />
        <SpeechLayer socket={this.socket} currentTestingDoc={this.state.currentTestingDoc} />
      </>
    )
  }


}

export default App
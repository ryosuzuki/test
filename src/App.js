import React, { Component } from 'react'
import './App.css'
// import Canvas from './Canvas'
import { io } from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this

  }

  componentDidMount() {

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
        <a-plane class="cantap" position="0 0 0" rotation="-90 0 0" width="10" height="10" color="#ccc"></a-plane>
      </>
    )
  }


}

export default App
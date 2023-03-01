import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import Summary from './Summary.js'
import Highlight from './Highlight.js'

import ocr from './sample/ocr.json'
import summary from './sample/summary.json'
import visualize from './sample/visualize.json'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.example = null
    this.state = {
      toios: [],
      shapes: [],
      currentPoints: [],
      currentPaths: [],
      currentId: -1,
      event: {},
      menuPos: { x: -300, y: -300 }
    }

    this.pressed = []
  }

  componentDidMount() {
    this.socket = App.socket
  }

  mouseDown(pos) {
    let event = new MouseEvent('mousedown' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousemove' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointermove(event)
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mouseup' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    Konva.DD._endDragBefore(event)
    this.stage._pointerup(event)
    Konva.DD._endDragAfter(event)
  }

  stageMouseDown(event) {
    console.log(event)
    this.setState({ event: event })
    if (event.target !== this.stage) return
    let pos = this.stage.getPointerPosition()
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  stageMouseMove(event) {
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  stageMouseUp(event) {
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false

    /*
    if (this.state.shapes.length === 3) {
      this.setState({ currentPoints: [], toios: [{ x: 100, y: 100 }] })
      return
    }
    */
    this.morph()
  }

  onContextMenu(event) {
    console.log(this)
    event.evt.preventDefault()
    console.log('context')
  }

  onToioClick(id) {
    console.log(id)
    let x = this.state.event.evt.clientX
    let y = this.state.event.evt.clientY
    this.setState({ menuPos: { x: x, y: y }, toioId: id })
  }

  onShapeClick(id) {
    console.log(id)
    let x = this.state.event.evt.clientX
    let y = this.state.event.evt.clientY
    this.setState({ menuPos: { x: x, y: y }, currentId: id })
  }

  onGravityClick() {
    let shapes = this.state.shapes
    shapes[this.state.currentId].physics = 'dynamic'
    this.setState({ shapes: shapes, menuPos: { x: -300, y: -300 } })
  }

  onStaticClick() {
    let shapes = this.state.shapes
    shapes[this.state.currentId].physics = 'static'
    this.setState({ shapes: shapes, menuPos: { x: -300, y: -300 } })
  }

  onElasticClick() {
    let shapes = this.state.shapes
    let line = shapes.pop()
    // let anchor = shapes.pop()
    this.setState({ shapes: shapes })
    this.rope.show(this, line)
    this.setState({ menuPos: { x: -300, y: -300 } })
  }

  onMouseDown() {
    console.log(this)
  }

  onMouseMove() {
    console.log('move')
  }

  onMouseUp() {
    console.log('up')
  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage
            width={ App.size }
            height={ App.size }
            onMouseDown={ this.stageMouseDown.bind(this) }
            onMouseMove={ this.stageMouseMove.bind(this) }
            onMouseUp={ this.stageMouseUp.bind(this) }
          >
            <Layer ref={ ref => (this.layer = ref) }>
              {/* Canvas Background */}
              <Rect 
                x={ 0 }
                y={ 0 }
                width={ App.size }
                height={ App.size }
                fill={ '#eee' }
              />
              {/* Paper Outline */}
              <Rect 
                x={ App.size/2 }
                y={ App.size/2 }
                width={ App.size * 850 / 1100 }
                height={ App.size }
                offsetX={ App.size * 850 / 1100 /2 }
                offsetY={ App.size/2 }                
                fill={ App.fillColorAlpha }
              />
              {/* Summary */}
              <Summary 
                text={ App.state.summary }
              />

              {/* Highlight */}
              <Highlight 
                textAnnotations={ App.state.highlight }
              />

              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
              />
              <Circle
                x={ 100 }
                y={ 100 }
                radius={ 100 }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
                fill={ App.fillColorAlpha }
                visible={ true }
                draggable
              />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas
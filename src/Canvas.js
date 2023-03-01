import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'

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
              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
              />
              {/* Gravity and Static Menu */}
              <Group
                x={ this.state.menuPos.x }
                y={ this.state.menuPos.y }
                width={ 200 }
                height={ 50 }
              >
                <Rect
                  width={ 200 }
                  height={ 50 }
                  fill={ '#eee' }
                />
                <Text
                  width={ 200 }
                  height={ 50 }
                  text={ 'Add Gravity' }
                  fontSize={30}
                  align={ 'center' }
                  verticalAlign={ 'middle' }
                  onClick={ this.onGravityClick.bind(this) }
                  onTap={ this.onGravityClick.bind(this) }
                />
                <Rect
                  x={ 0 }
                  y={ 50 }
                  width={ 200 }
                  height={ 50 }
                  fill={ '#eee' }
                />
                <Text
                  x={ 0 }
                  y={ 50 }
                  width={ 200 }
                  height={ 50 }
                  text={ 'Static' }
                  fontSize={30}
                  align={ 'center' }
                  verticalAlign={ 'middle' }
                  onClick={ this.onStaticClick.bind(this) }
                  onTap={ this.onStaticClick.bind(this) }
                />
                { this.example === 'rope' &&
                  <>
                    <Rect
                      x={ 0 }
                      y={ 100 }
                      width={ 200 }
                      height={ 50 }
                      fill={ '#eee' }
                    />
                    <Text
                      x={ 0 }
                      y={ 100 }
                      width={ 200 }
                      height={ 50 }
                      text={ 'Elastic' }
                      fontSize={30}
                      align={ 'center' }
                      verticalAlign={ 'middle' }
                      onClick={ this.onElasticClick.bind(this) }
                      onTap={ this.onElasticClick.bind(this) }
                    />


                  </>
                }


              </Group>
              {/* Transform Path */}
              <Group>
                { this.state.currentPaths.map((path, i) => {
                  return (
                    <Path
                      key={ i }
                      data={ path.data }
                      stroke={ App.strokeColor }
                      strokeWidth={ App.strokeWidth }
                    />
                  )
                }) }
              </Group>
              { this.state.toios.map((toio, i) => {
                  return (
                    <Rect
                      key={ i }
                      id={ `cube-${i}` }
                      name={ `cube-${i}` }
                      x={ toio.x }
                      y={ toio.y }
                      rotation={ toio.angle }
                      radius={ 40 }
                      width={ App.toioSize }
                      height={ App.toioSize }
                      offsetX={ App.toioSize/2 }
                      offsetY={ App.toioSize/2 }
                      strokeWidth={ App.strokeWidth }
                      stroke={ App.toioStrokeColor }
                      fill={ App.toioFillColorAlpha }
                      draggable
                      onClick={ this.onShapeClick.bind(this, i) }
                      onTap={ this.onShapeClick.bind(this, i) }
                    />
                  )
              }) }
              {/* All Sketched Shapes */}
              { this.state.shapes.map((shape, i) => {
                  if (shape.type === 'toio') {
                    let width = shape.width ? shape.width : App.toioSize
                    let height = shape.height ? shape.height : App.toioSize
                    return (
                      <Rect
                        key={ i }
                        id={ `toio-${i}` }
                        name={ `toio-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        rotation={ shape.angle }
                        angleFix={ true } // For pong
                        radius={ 40 }
                        width={ width }
                        height={height }
                        offsetX={ width/2 }
                        offsetY={ height/2 }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.toioStrokeColor }
                        fill={ App.toioFillColorAlpha }
                        // fill={ 'rgba(54, 40, 0, 0.01)' }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'toio-circle') {
                    return (
                      <Circle
                        key={ i }
                        id={ `toio-circle-${i}` }
                        name={ `toio-circle-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        radius={ 40 }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.toioStrokeColor }
                        fill={ App.toioFillColorAlpha }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'rect') {
                    return (
                      <Rect
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        width={ shape.width }
                        height={ shape.height }
                        offsetX={ shape.width/2 }
                        offsetY={ shape.height/2 }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        fill={ App.fillColorAlpha }
                        rotation={ shape.rotation }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'circle') {
                    return (
                      <Circle
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        radius={ shape.radius }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        fill={ App.fillColorAlpha }
                        visible={ shape.visible }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'line') {
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'linetwo') { // contraint between two bodies
                    let color = shape.strokeColor ? shape.strokeColor : App.strokeColor
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
                        strokeWidth={ App.strokeWidth }
                        stroke={ color }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'lineelastic') { // super elastoc constraint for InSitu TUI
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'spring') {
                    return (
                      <Spring
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        length={ shape.length }
                        start={ shape.start }
                        end={ shape.end }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.toioStrokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
              }) }
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas
import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import Summary from './Summary.js'
import Highlight from './Highlight.js'
import Hierarchy from './Hierarchy.js'
import Images from './Images.js'
import ReferencePages from './ReferencePages.js'
import Flashcards from './Flashcards.js'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
    }
  }

  componentDidMount() {
    this.socket = App.socket
  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage
            width={App.size}
            height={App.size}
          >
            <Layer ref={ref => (this.layer = ref)} listening={false}>
              {/* Canvas Background */}
              <Rect
                x={0}
                y={0}
                width={App.size}
                height={App.size}
                fill={'#00000033'}
              />
              {/* Paper Outline */}
              <Rect
                x={App.size / 2}
                y={App.size / 2}
                width={App.size * 850 / 1100 / 1.5}
                height={App.size / 1.5}
                offsetX={App.size * 850 / 1100 / 3}
                offsetY={App.size / 3}
                fill={'#b2fbff01'}
              />

              <Summary
                text={App.state.summary}
              />

              <Hierarchy
                hierarchy={App.state.hierarchy}
              />

              <Highlight
                textAnnotations={App.state.highlight}
              />

              <Images
                images={App.state.images}
              />

              <ReferencePages
                showReferencePages={App.state.showReferencePages}
              />

              <Flashcards flashcardsData={App.state.flashcards} />

              {/* Drawing Line */}
              {/* <Line
                points={this.state.currentPoints}
                stroke={App.strokeColor}
                strokeWidth={App.strokeWidth}
              />
              <Circle
                x={100}
                y={100}
                radius={50}
                strokeWidth={App.strokeWidth}
                stroke={App.strokeColor}
                fill={App.fillColorAlpha}
                visible={true}
                draggable
              /> */}
            </Layer>

          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas
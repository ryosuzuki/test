import React, { Component } from 'react'
import { Group, Rect } from 'react-konva'

class Highlight extends Component {
  constructor(props) {
    super(props)
    window.Highlight = this
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        {/* Highlight */}
        <Group
          x={ 0 }
          y={ 0 }
          width={ App.size }
          height={ 50 }
        >
          { this.props.textAnnotations.map((textAnnotation, i) => {
            if (i === 0) { return <></> }
            let ocrWidth = 1660
            let ocrHeight = 2149
            let ratioWidth = App.size / ocrWidth
            let ratioHeight = App.size / ocrHeight
            let vertices = textAnnotation.boundingPoly.vertices
            let x = vertices[0].x * ratioWidth
            let y = vertices[0].y * ratioHeight
            let width = (vertices[2].x - vertices[0].x) * ratioWidth
            let height = (vertices[2].y - vertices[0].y) * ratioHeight
            return (
              <Rect
                key={ i }
                x={ x }
                y={ y }
                width={ width }
                height={ height }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
                fill={ App.fillColorAlpha }
                rotation={ 0 }
                draggable
              />                  
            )
          })}
        </Group>
      </>
    )
  }
}

export default Highlight
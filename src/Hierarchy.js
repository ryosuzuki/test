import React, { Component } from 'react'
import { Group, Text } from 'react-konva'
import RectanglWithText from './components/RectangleWithText'

class Hierarchy extends Component {
  constructor(props) {
    super(props)
    window.hierarchy = this
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        {/* Hierarchy */}
        {this.props.hierarchy!==''&&<RectanglWithText
          x={10}
          y={10}
          width={250}
          textWidth={220}
          heading={'Index'}
          description={this.props.hierarchy}
        />}
        {/* <Group
          x={0}
          y={0}
          width={App.size}
          height={50}
        >
          <Text
            width={500}
            height={1000}
            text={this.props.hierarchy}
            fontSize={19}
            align={'left'}
            verticalAlign={'middle'}
          />
        </Group> */}
      </>
    )
  }
}

export default Hierarchy
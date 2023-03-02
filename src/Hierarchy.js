import React, { Component } from 'react'
import { Group, Text } from 'react-konva'

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
        <Group
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
        </Group>
      </>
    )
  }
}

export default Hierarchy
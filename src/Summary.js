import React, { Component } from 'react'
import { Group, Text } from 'react-konva'

class Summary extends Component {
  constructor(props) {
    super(props)
    window.Summary = this
  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        {/* Summary */}
        <Group
          x={ 0 }
          y={ 0 }
          width={ App.size }
          height={ 50 }
        >
          <Text
            width={ App.size }
            height={ 350 }
            text={ this.props.text }
            fontSize={ 30 }
            align={ 'center' }
            verticalAlign={ 'middle' }
          />                
        </Group>
      </>
    )
  }
}

export default Summary
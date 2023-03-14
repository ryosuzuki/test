import React from 'react'
import { useState, useEffect } from 'react'
import { Group, Text } from 'react-konva'
import RectanglWithText from './components/RectangleWithText'

function Summary(props:{text:string}) {
  return (
    <>
      {props.text&&<RectanglWithText 
      x={10}
      y={10}
      width={250}
      textWidth={220}
      heading={'Summary'}
      description={props.text}
      />}
    </>
  )
}

export default Summary
import React from 'react'
import { useState, useEffect } from 'react'
import { Group, Text } from 'react-konva'
import RectanglWithText from './components/RectangleWithText'

function KeyWords(props:{text:string}) {
  return (
    <>
      {props.text!==''&&<RectanglWithText 
      x={10}
      y={400}
      width={250}
      textWidth={220}
      heading={'Key Words'}
      description={props.text}
      />}
    </>
  )
}

export default KeyWords
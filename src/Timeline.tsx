//@ts-nocheck
import React from 'react'
import { useState, useEffect } from 'react'
import { Group, Text } from 'react-konva'
import RectanglWithText from './components/RectangleWithText'

function Timeline(props:{text:string}) {
  return (
    <>
      {props.text&&<RectanglWithText 
      x={800}
      y={200}
      width={200}
      textWidth={100}
      heading={'Timeline'}
      description={props.text}
      />}
    </>
  )
}

export default Timeline
import React, { Component, useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import Summary from './Summary.js'
import Highlight from './Highlight'
import Hierarchy from './Hierarchy.js'
import Images from './Images.js'
import ReferencePages from './ReferencePages.js'
import Flashcards from './Flashcards.js'
import Profile from './Profile.js'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { Socket } from 'socket.io-client'
import { Vocabulary } from './Vocabulary'


let ocr: any;
export default function Canvas(props: { 
  size: number, 
  state: any, 
  debug: boolean, 
  space:number,
  socket: Socket, 
  currentTestingDoc: number
 }) {
  const ref = useRef<Konva.Layer>();
  const [relativecoord, setRelative] = useState(0);

  useEffect(()=>{
    console.log(ref.current);
    setRelative((props.space / 2)-(props.size/2))
  },[])

  return (
    <>
      <div style={{ display: props.debug ? 'block' : 'none' }}>
        <Stage
          width={props.space}
          height={props.space}
        >

          <Layer visible={true}>
            {/* Canvas Background */}
            <Group>
            <Text text="Overlays" fontSize={50} />
            </Group>
            <Group>
                {/* Gray */}
              <Rect
                x={0}
                y={0}
                width={props.space}
                height={props.space}
                fill={'#00000033'}
              />

              {/* Paper Around Red */}
              <Rect
                x={relativecoord}
                y={relativecoord}
                width={props.size}
                height={props.size}
                fill={'#ff000045'}
              />


              {/* Paper Outline Black */}
              <Rect
                x={props.space / 2}
                y={props.space / 2}
                width={props.size * 850 / 1100 / 1.5}
                height={props.size / 1.5}
                offsetX={props.size * 850 / 1100 / 3}
                offsetY={props.size / 3}
                fill={'#00000078'}
              />

              <Vocabulary word={'taxonomy'} textAnnotations={props.state.vocabulary} relative={relativecoord} />

              <Summary
                text={props.state.summary}
              />

              <Hierarchy
                hierarchy={props.state.hierarchy}
              />

              <Highlight
                textAnnotations={props.state.highlight}
                relative={relativecoord}
              />

              <Images
                images={props.state.images}
              />

              <ReferencePages
                showReferencePages={props.state.showReferencePages}
              />

              <Flashcards flashcardsData={props.state.flashcards} />

              <Profile profileData={props.state.profile} />
            </Group>


          </Layer>

        </Stage>
      </div>
    </>
  )
}

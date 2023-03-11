import React, { Component, useState } from 'react'
import { Group, Rect } from 'react-konva'

const Highlight = (props:{ textAnnotations:{boundingPoly:{vertices:{x:number, y:number}[]}, description:string}[], relative:number }) => {
  // useEffect(() => {
  //   window.Highlight = Highlight;
  // }, []);

  const ocrWidth = 1660;
  const ocrHeight = 2149;
  const ratioWidth = 1024 / ocrWidth;
  const ratioHeight = 1024 / ocrHeight;

  return (
    <>
      {/* Highlight */}
      <Group x={props.relative} y={props.relative} width={1024} height={50}>
        {props.textAnnotations.map((textAnnotation, i) => {
          //ar authoring tools
          const vertices = textAnnotation.boundingPoly.vertices;
          const x = vertices[0].x * ratioWidth;
          const y = vertices[0].y * ratioHeight;
          const width = (vertices[2].x - vertices[0].x) * ratioWidth;
          const height = (vertices[2].y - vertices[0].y) * ratioHeight;

          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              strokeWidth={8}
              stroke={'#002f2b'}
              fill={'rgba(0, 28, 26, 0.4)'}
              rotation={0}
              draggable
            />
          );
        })}
      </Group>
    </>
  );
};

export default React.memo(Highlight, (prev, next)=>{
  if(prev.textAnnotations.length===next.textAnnotations.length){
    return true
  }else{
    return false
  }
})
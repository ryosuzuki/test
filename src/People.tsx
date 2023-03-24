import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Line, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import RectangleWithText from './components/RectangleWithText'

const ocrWidth = 1660;
const ocrHeight = 2149;
const ratioWidth = 1024 / ocrWidth;
const ratioHeight = 1024 / ocrHeight;

export function People(props: {
    textAnnotations: { boundingPoly: { vertices: { x: number, y: number }[] }, description: string, meaning: string, imageURL:string, title:string }[],
    relative: number, word: string | null
}) {

    return (
        props.textAnnotations.length > 0 ?
            <>
                <Group x={props.relative} y={props.relative} >
                    {props.textAnnotations.map((textAnnotation, i) => {
                        if(i!==props.textAnnotations.length-1){
                            return <></>
                        }
                        //ar authoring tools
                        const vertices = textAnnotation.boundingPoly.vertices;

                        // highlight dimensions
                        let highlightx = vertices[0].x * ratioWidth;
                        let highlighty = vertices[0].y * ratioHeight;
                        let highlightwidth = (vertices[2].x - vertices[0].x) * ratioWidth;
                        let highlightheight = (vertices[2].y - vertices[0].y) * ratioHeight;

                        // card dimensions
                        let cardx = 10 - props.relative
                        let cardy = highlighty - 100
                        let cardwidth = 200
                        let cardheight = 200

                        // line dimensions
                        let linex = (10 - props.relative) + 200;
                        let liney = highlighty;
                        let linewidth = (highlightx + props.relative) - cardwidth;
                        let lineheight = 5;

                        if (highlightx > 1024 / 2) {
                            // 1024 is size
                            cardx = (props.relative + 1024) - cardwidth - 10;
                            linex = highlightx + highlightwidth;
                            linewidth = (linewidth - (cardwidth / 2 + 10))
                        }

                        return (
                            <>

                                {/* highlight */}
                                <Rect
                                    x={highlightx}
                                    y={highlighty}
                                    width={highlightwidth}
                                    height={highlightheight}
                                    strokeWidth={8}
                                    stroke={'#002f2b'}
                                    fill={'rgba(0, 28, 26, 0.4)'}
                                    rotation={0}
                                    draggable
                                />

                                {/* Line */}
                                <Rect
                                    x={linex}
                                    y={liney}
                                    width={linewidth}
                                    height={lineheight}
                                    fill={'rgba(0, 28, 26, 0.4)'}
                                />

                                {/* card */}
                                <RectangleWithText
                                    heading={textAnnotation.title}
                                    description={textAnnotation.meaning}
                                    width={cardwidth}
                                    x={cardx}
                                    y={cardy}
                                    url={textAnnotation.imageURL}
                                />
                            </>)
                    })}
                </Group>
            </>
            : <></>
    )
}


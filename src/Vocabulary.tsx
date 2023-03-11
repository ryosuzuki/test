import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Line, Rect, Text } from "react-konva";

const ocrWidth = 1660;
const ocrHeight = 2149;
const ratioWidth = 1024 / ocrWidth;
const ratioHeight = 1024 / ocrHeight;

export function Vocabulary(props: {
    textAnnotations: { boundingPoly: { vertices: { x: number, y: number }[] }, description: string, meaning: string }[],
    relative: number, word: string | null
}) {

    return (
        props.textAnnotations.length > 0 ?
            <>
                <Group x={props.relative} y={props.relative} >
                    {props.textAnnotations.map((textAnnotation, i) => {
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
                        
                        if(highlightx>1024/2){
                            // 1024 is size
                            cardx = (props.relative + 1024) - cardwidth -10;
                            linex = highlightx + highlightwidth;
                            linewidth = (linewidth - (cardwidth/2 + 10)) 
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
                                    height={cardheight}
                                    heading={textAnnotation.description}
                                    description={textAnnotation.meaning}
                                    width={cardwidth}
                                    x={cardx}
                                    y={cardy}
                                />
                            </>)
                    })}
                </Group>
            </>
            : <></>
    )
}

const RectangleWithText = ({ x, y, width, height, heading, description }: {
    x: number, y: number, width: number, height: number, heading: string, description: string
}) => {
    const [textHeight, setTextHeight] = useState(0);
    const textref = useRef<Konva.Text>(null)
    useEffect(()=>{
        setTextHeight(textref.current?.getHeight())
    },[])
    return (
        <Group zIndex={200}>
            <Rect
                x={x}
                y={y}
                width={width}
                height={textHeight+69}
                fill="white"
                stroke="#555"
                strokeWidth={1}
                cornerRadius={10}
                shadowColor={'black'}
                shadowBlur={10}
                shadowOffsetX={10}
                shadowOffsetY={10}
                shadowOpacity={0.2}
            />
            <Text
                x={x + 10}
                y={y + 20}
                fontSize={19}
                text={heading}
                width={190}
                wrap={'word'}
                fontStyle={'bold'}
            />
            <Text
                ref = {textref}
                x={x + 10}
                y={y + 55}
                fontSize={14}
                text={description}
                width={190}
                wrap={'word'}
            />
        </Group>
    )
}
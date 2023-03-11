import React, { useEffect, useState } from "react";
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
                <Group x={props.relative} y={props.relative} width={1024} height={50}>
                    {props.textAnnotations.map((textAnnotation, i) => {
                        //ar authoring tools
                        const vertices = textAnnotation.boundingPoly.vertices;

                        // highlight dimensions
                        const highlightx = vertices[0].x * ratioWidth;
                        const highlighty = vertices[0].y * ratioHeight;
                        const highlightwidth = (vertices[2].x - vertices[0].x) * ratioWidth;
                        const highlightheight = (vertices[2].y - vertices[0].y) * ratioHeight;

                        // card dimensions
                        const cardx = 10 - props.relative
                        const cardy = highlighty - 100
                        const cardwidth = 200
                        const cardheight = 200

                        // line dimensions
                        const linex = (10 - props.relative) + 200;
                        const liney = highlighty;
                        const linewidth = (highlightx + props.relative) - cardwidth;
                        const lineheight = 5;

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

                                {/* card */}
                                <RectangleWithText
                                    height={cardheight}
                                    heading={textAnnotation.description}
                                    description={textAnnotation.meaning}
                                    width={cardwidth}
                                    x={cardx}
                                    y={cardy}
                                />

                                {/* Line */}
                                <Rect
                                    x={linex}
                                    y={liney}
                                    width={linewidth}
                                    height={lineheight}
                                    fill={'rgba(0, 28, 26, 0.4)'}
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
    return (
        <Group>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#d7d3d573"
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
                x={x + 10}
                y={y + 75}
                fontSize={14}
                text={description}
                width={190}
                wrap={'word'}
            />
        </Group>
    )
}
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Rect, Text } from "react-konva";


export default function RectanglWithText({ x, y, width, heading, description, textWidth = 190 }: {
    x: number, y: number, width: number, heading: string, description: string, textWidth?:number
}) {
    const [textHeight, setTextHeight] = useState(0);
    const [headingheight, setheadingheight] = useState(0);
    const textref = useRef<Konva.Text>(null)
    const headingref = useRef<Konva.Text>(null)
    useEffect(() => {
        setTextHeight(textref.current?.getHeight())
        setheadingheight(headingref.current?.getHeight())
    }, [])
    return (
        <Group zIndex={200}>
            <Rect
                x={x}
                y={y}
                width={width}
                height={textHeight + headingheight + 50}
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
                ref={headingref}
                x={x + 10}
                y={y + 20}
                fontSize={19}
                text={heading.toLocaleUpperCase()}
                width={textWidth}
                wrap={'word'}
                fontStyle={'bold'}
            />
            <Text
                ref={textref}
                x={x + 10}
                y={y + headingheight + 30}
                fontSize={14}
                text={description}
                width={textWidth}
                wrap={'word'}
            />
        </Group>
    )
}
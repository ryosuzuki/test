import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Rect, Text } from "react-konva";


export default function ListTextBox({ x, y, width, heading, list }: {
    x: number, y: number, width: number, heading: string, list: any
}) {
    const [textHeight, setTextHeight] = useState(100);
    const [headingheight, setheadingheight] = useState(0);
    const textref = useRef<Konva.Group>(null)
    const headingref = useRef<Konva.Text>(null)


    const itemHeight = 40; // adjust height as needed
    const listHeight = Object.keys(list).length * itemHeight + 20; // adjust padding as needed
    useEffect(() => {
        // setTextHeight()
        console.log(textref.current?.clipHeight)
        setheadingheight(headingref.current?.getHeight())
    }, [])
    return (
        <Group
            x={x}
            y={y} zIndex={200}>
            <Rect
                width={width}
                height={listHeight + headingheight + 50}
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
                x={10}
                y={20}
                fontSize={20}
                text={heading.toLocaleUpperCase()}
                wrap={'word'}
                fontStyle={'bold'}
            />
            {
                Object.keys(list).map((obj, index) => (
                    <ListText
                        {...{ list, headingheight, itemHeight, obj, index }}
                    />
                ))
            }
        </Group>
    )
}

function ListText({ index, headingheight, itemHeight, obj, list }: { index: number, headingheight: number, itemHeight: number, obj: string, list: any }) {


    const [firstLength, setFirstLength] = useState(null)
    const firstref = useRef<Konva.Text>(null)
    useEffect(() => {
        setFirstLength(firstref.current?.getWidth())
    }, [])

    return (
        <>
            <Text
                ref={firstref}
                key={index}
                x={10} // adjust position as needed
                y={headingheight + 30 + 20 + index * itemHeight} // adjust position and spacing as needed
                text={`${obj}: `}
                fontSize={19}
            />
            {firstLength ? <Text
                x={10 + firstLength}
                y={headingheight + 30 + 20 + index * itemHeight}
                fontSize={19}
                text={`${String(list[obj])}`}
                width={190}
                wrap={'word'}
                fontStyle={'bold'}
            /> : <></>}
        </>
    )
}
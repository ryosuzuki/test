import React, { Component, useState } from 'react'
import { Group, Text, Image, Rect, Stage, Layer } from 'react-konva'
import useImage from 'use-image';

const IMG = ({ url, x, y }) => {
    const [image] = useImage(url, 'anonymous');
    return <Image image={image}
        x={x}
        y={y}
        width={200}
        height={150}
    />;
};

const RectangleWithText = ({ x, y, width, height, text }) => {
    return (
        <Group>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#ddd"
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
                y={y + 10}
                text={text}
            />
        </Group>
    )
}

class Flashcards extends Component {
    constructor(props) {
        super(props)
        window.images = this
    }

    componentDidMount() {
    }

    render() {
        return (
            <RectangleWithText height={150} text={"hello"} width={200} x={0} y={0} />
        )
    }
}

export default Flashcards
import { keyBy } from 'lodash';
import React, { Component, useState } from 'react'
import { Group, Text, Image, Rect, Stage, Layer } from 'react-konva'
import useImage from 'use-image';

// keeping this function because we may want 
// to show relevant img for each card in future
const IMG = ({ url, x, y }) => {
    const [image] = useImage(url, 'anonymous');
    return <Image image={image}
        x={x}
        y={y}
        width={200}
        height={150}
    />;
};

const RectangleWithText = ({ x, y, width, height, heading, description }) => {
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

// Random points for card placement - Delete later if the  
// cards are connected to relevant text inside the document
const points = [];
for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 800);
    points.push({ x, y });
}
console.log(points);

class Flashcards extends Component {
    constructor(props) {
        super(props)
        window.images = this
    }

    componentDidMount() {
    }

    render() {
        const { flashcardsData } = this.props;
        return (
            <>
                {
                    Object.keys(flashcardsData).map((key, index) => {
                        return (
                            <RectangleWithText
                                height={150}
                                heading={key}
                                description={flashcardsData[key]}
                                width={200}
                                x={points[index].x}
                                y={points[index].y}
                            />
                        )
                    })
                }
            </>
        )
    }
}

export default Flashcards
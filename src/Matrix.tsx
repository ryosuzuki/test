import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Text, Line, Rect } from "react-konva";

const Matrix = (props: {
    data: {
        [item: string]: string[]
    }
}) => {

    const benefitsRef = useRef<Konva.Group>(null);
    const challengesRef = useRef<Konva.Group>(null);
    const [totalHeight, setTotalHeight] = useState(0);

    useEffect(() => {
        if (benefitsRef.current && challengesRef.current) {
            // Calculate total height needed for rendering all text items
            const benefitsTextHeight =
                benefitsRef.current.children!.reduce(
                    (total, child) => total + child.height(),
                    0
                );
            const challengesTextHeight =
                challengesRef.current.children!.reduce(
                    (total, child) => total + child.height(),
                    0
                );
            setTotalHeight(Math.max(benefitsTextHeight, challengesTextHeight)+100);
        }

    }, [props.data]);

    return (
        props.data ? <Group>
            <Rect
                x={0}
                y={0}
                width={320}
                height={totalHeight}
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
            <Line points={[160, 0, 160, totalHeight]} stroke="black" strokeWidth={1} />
            <Text text="Benefits" fontSize={20} fontFamily="Arial" x={10} y={10} />
            <Text text="Challenges" fontSize={20} fontFamily="Arial" x={180} y={10} />

            <Group ref={benefitsRef}>
                {Object.values(props.data)[0].map((value, i) => (
                    <Text key={i} text={value} fontSize={16} fontFamily="Arial" x={10} y={50 + i * 40} width={150} />
                ))}
            </Group>
            <Group ref={challengesRef}>
                {Object.values(props.data)[1].map((value, i) => (
                    <Text key={i} text={value} fontSize={16} fontFamily="Arial" x={180} y={50 + i * 40} width={150} />
                ))}
            </Group>

        </Group> : <></>
    );
};

export default Matrix;

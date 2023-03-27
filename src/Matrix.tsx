//@ts-nocheck
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
        props.data ? <Group x={700} y={100}>
            <Rect
                x={0}
                y={0}
                width={240}
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
            <Line points={[120, 0, 120, totalHeight]} stroke="black" strokeWidth={1} />
            <Text text="Benefits" fontSize={12} fontFamily="Arial" x={10} y={15} fontStyle={'bold'}/>
            <Text text="Challenges" fontSize={12} fontFamily="Arial" x={130} y={15} fontStyle={'bold'}/>

            <Group ref={benefitsRef}>
                {Object.values(props.data)[0].map((value, i) => (
                    <Text key={i} text={value} fontSize={10} fontFamily="Arial" x={10} y={40 + i * 30} width={100} />
                ))}
            </Group>
            <Group ref={challengesRef}>
                {Object.values(props.data)[1].map((value, i) => (
                    <Text key={i} text={value} fontSize={10} fontFamily="Arial" x={130} y={40 + i * 30} width={100} />
                ))}
            </Group>

        </Group> : <></>
    );
};

export default Matrix;

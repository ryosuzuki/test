import React, { Component, useState } from 'react'
import { Group, Text, Image, Rect, Stage, Layer } from 'react-konva'

// Random points for card placement - Delete later if the  
// cards are connected to relevant text inside the document
const points = [];
for (let i = 0; i < 20; i++) {
    // const x = Math.floor(Math.random() * 800);
    // const y = Math.floor(Math.random() * 800);
    if(i<5){
        const x = 10  
        const y = 190 * i + 10
        points.push({ x, y });
    } else {
        const x = 810 
        const y = 190 * (i-5) + 10
        points.push({ x, y });
    }
}
// console.log(points)

const MakeProfile = ({ title, tags, description, x, y }) => {
    return (
        <>
            <Group>
                <Rect
                    x={x}
                    y={y}
                    width={200}
                    height={180}
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
                    text={title}
                    width={185}
                    wrap={'word'}
                    fontStyle={'bold'}
                />
                <Text
                    x={x + 10}
                    y={y + 55}
                    fontSize={13}
                    text={'⦿ ' + tags.map(str => str.toUpperCase()).join('\n⦿ ')}
                    width={185}
                    lineHeight={1.5}
                    fontStyle={'bold'}
                    fill={'teal'}
                    wrap={'word'}
                />
                <Text
                    x={x + 10}
                    y={y + 100}
                    fontSize={14}
                    text={description}
                    width={185}
                    wrap={'word'}
                />
            </Group>
        </>
    )
}

class Profile extends Component {
    constructor(props) {
        super(props)
        window.images = this
    }

    componentDidMount() {
    }

    render() {
        const profileData = this.props.profileData;
        const profiles = Object.keys(profileData)
        // console.log(profileData)

        return (
            <>
                {
                    profiles.map((title, index) => {
                        return (
                            <MakeProfile
                                title={title}
                                tags={profileData[title].tag}
                                description={profileData[title].info}
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

export default Profile
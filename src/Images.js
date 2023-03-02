import React, { Component, useState } from 'react'
import { Group, Text, Image } from 'react-konva'
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

const IMGs = ({ urls }) => {
    // console.log(urls)
    let x = -10
    let y = -150

    return <Group
        x={-50}
        y={0}
        width={App.size}
        height={50}
    >
        {urls.map(url => {
            y += 150
            return <IMG
                url={url}
                x={x}
                y={y}
            />
        })
        }
    </Group>;
};

class Images extends Component {
    constructor(props) {
        super(props)
        window.images = this
    }

    componentDidMount() {
    }

    render() {
        return (
            <>
                {/* Images */}
                <IMGs urls={this.props.images} />
            </>
        )
    }
}

export default Images
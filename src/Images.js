import React, { Component, useState } from 'react'
import { Group, Text, Image } from 'react-konva'
import useImage from 'use-image';

const IMG = ({ url }) => {
    const [image] = useImage(url, 'anonymous');
    return <Image image={image} />;
};

const IMGs = ({ urls }) => {
    return <Group
        x={0}
        y={0}
        width={App.size}
        height={50}
    >
        <IMG url={urls[0]} />
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
                <IMGs urls={this.props.images}/>
                {/* <Group
                    x={0}
                    y={0}
                    width={App.size}
                    height={50}
                >
                    <IMG imageUrl={this.props.images[0]} />
                </Group> */}
            </>
        )
    }
}

export default Images
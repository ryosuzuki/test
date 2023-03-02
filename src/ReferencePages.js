import React, { Component, useState } from 'react'
import { Group, Text, Image } from 'react-konva'
import useImage from 'use-image';

let page = 'https://binaries.templates.cdn.office.net/support/templates/en-us/lt03463084_quantized.png'
let pages = [page, page, page, page, page]

const IMG = ({ url, x, y }) => {
    const [image] = useImage(url, 'anonymous');
    return <Image image={image}
        x={x}
        y={y}
        width={125}
        height={150}
    />;
};

const IMGs = ({ urls }) => {
    let x = 0
    let y = 10

    return <Group
        x={0}
        y={0}
        width={App.size}
        height={50}
    >
        {urls.map(url => {
            x += 150    
            return <IMG
                url={url}
                x={x}
                y={y}
            />
        })
        }
    </Group>;
};

class ReferencePages extends Component {
    constructor(props) {
        super(props)
        window.images = this
    }

    componentDidMount() {
    }

    render() {
        return (
            <>
                {/* Reference Pages */}
                {this.props.showReferencePages && <IMGs urls={[...pages]} />}
            </>
        )
    }
}

export default ReferencePages
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Rect, Text, Image } from "react-konva";
import useImage from "use-image";

export default function RectanglWithText({ x, y, width, heading, description, textWidth = 190, url }: {
    x: number, y: number, width: number, heading: string, description: string, textWidth?:number, url?:string
}) {
    const [textHeight, setTextHeight] = useState(0);
    const [headingheight, setheadingheight] = useState(0);
    const [imageHeight, setImageheight] = useState(0);
    const textref = useRef<Konva.Text>(null)
    const headingref = useRef<Konva.Text>(null)
    useEffect(() => {
        setTextHeight(textref.current?.getHeight())
        setheadingheight(headingref.current?.getHeight());
        if(url&&url!==undefined){
            setImageheight(150)
        }else{
            setImageheight(0)
        }
    }, [url])
    return (
        <Group zIndex={200}>
            <Rect
                x={x}
                y={y}
                width={width}
                height={textHeight + headingheight + 50 + imageHeight}
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
            <IMG url={url} x={x} y={y} />
            <Text
                ref={headingref}
                x={x + 10}
                y={y + 20 + imageHeight}
                fontSize={14}
                text={heading.toLocaleUpperCase()}
                width={textWidth}
                wrap={'word'}
                fontStyle={'bold'}
            />
            <Text
                ref={textref}
                x={x + 10}
                y={y + headingheight + 30 + imageHeight}
                fontSize={10}
                text={description}
                width={textWidth}
                wrap={'word'}
            />
        </Group>
    )
}

const IMG = ({ url, x, y }:any) => {
    const imageRef = useRef<Konva.Image>(null);
    const [image] = useImage("https://api.codetabs.com/v1/proxy?quest="+url, "anonymous", 'origin');
    const [imageWidth, setImageWidth] = React.useState(0);
    const [imageHeight, setimageHeight] = React.useState(0);
    useEffect(()=>{
        if (imageRef.current) {
            const imageNode = imageRef.current;
            const w = imageNode.width();
            const h = imageNode.height();
            setImageWidth(w)
            setimageHeight(h)

            // imageRef.current.scaleX(1/(imageHeight/150))
            // imageRef.current.scaleY(1/(imageHeight/150))

            var widthRatio = (200) / w
            var heightRatio = (150) / h;
            var bestRatio = Math.min(widthRatio, heightRatio);
            var newWidth = w * bestRatio;
            var newHeight = h * bestRatio;

        }
    },[url])
    return <Image 
        ref={imageRef}
        image={image}
        x={x} //((imageWidth/2)*1/(imageHeight/150))
        y={y}
        width={200}
        height={150}
        // crop={{
        //     x:imageWidth/2,
        //     y:10,
        //     width:200,
        //     height:150
        // }}
        scaleX={1/(imageHeight/150)}
        scaleY={1/(imageHeight/150)}
    />
};
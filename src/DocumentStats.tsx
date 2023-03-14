import React from "react";
import ListTextBox from "./components/ListTextBox";
import RectangleWithText from "./components/RectangleWithText";

export function DocumentStats(props: {
    doc_stats: {[item:string]:number|string}
}) {

    return (
        props.doc_stats ? <ListTextBox
            heading={'Text Statistics'}
            list={props.doc_stats}
            width={240}
            x={10}
            y={10}
        /> : <></>
    )
}
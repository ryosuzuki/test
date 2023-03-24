//@ts-nocheck
import React, { Component } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva';
import Konva from 'konva';
import Summary from './Summary';
import {People} from './People'
import {ImageBox} from './image'
import Timeline from './Timeline';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Socket } from 'socket.io-client';

let ocr: any;
window.Konva = Konva
class Canvas extends Component {
  constructor(props:{ 
    size: number, 
    state: any, 
    debug: boolean, 
    space:number,
    socket: Socket, 
    currentTestingDoc: number
   }) {
    super(props)
    window.Canvas = this
    window.canvas = this

    this.ref = React.createRef();

    this.state = {
      relativecoord: 0
    };
  }

  componentDidMount() {
    console.log(this.ref.current);
    this.setState({
      relativecoord: (this.props.space / 2) - (this.props.size / 2)
    });
  }

  render() {
    return (
      <>
        <div style={{ display: 'none' }}>
          <Stage
            width={this.props.space}
            height={this.props.space}
          >

            <Layer visible={true}>
              {/* Canvas Background */}
              <Group>
                {/* <Text text="Overlays" fontSize={50} /> */}
              </Group>
              <Group>
                {/* Gray */}
                <Rect
                  x={0}
                  y={0}
                  width={this.props.space}
                  height={this.props.space}
                  fill={'#ff000000'}
                />

                {/* Paper Around Red */}
                <Rect
                  x={this.state.relativecoord}
                  y={this.state.relativecoord}
                  width={this.props.size}
                  height={this.props.size}
                  fill={'#ff000000'}
                />


                {/* Paper Outline Black */}
                <Rect
                  x={this.props.space / 2}
                  y={this.props.space / 2}
                  width={this.props.size * 850 / 1100 / 1.5}
                  height={this.props.size / 1.5}
                  offsetX={this.props.size * 850 / 1100 / 3}
                  offsetY={this.props.size / 3}
                  fill={'#00000012'}
                />

                <People word={'taxonomy'} textAnnotations={this.props.state.people} relative={this.state.relativecoord} />

                <ImageBox word={'taxonomy'} textAnnotations={this.props.state.image} relative={this.state.relativecoord} />

                <Summary
                  text={this.props.state.summary}
                />

                <Timeline text={this.props.state.timeline}/>
              </Group>
            </Layer>
          </Stage>
        </div>
      </>
    );
  }
}

export default Canvas;
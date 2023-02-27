import React, { Component } from 'react'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const inputVideo = document.getElementById('input_video')
    console.log(inputVideo)

    let temp = this
    navigator.mediaDevices
    .getUserMedia({
      video: true, audio: false,
    })
    .then(async function (stream) {
      inputVideo.srcObject = stream;
      inputVideo.play();
      // schedule the first one.
      // setTimeout(processVideo, 0);
      temp.cap = new cv.VideoCapture(inputVideo)
      temp.processing()
    })
    .catch(function (err) {
      console.log("An error occurred! " + err);
    })
  }

  processing() {
    console.log('hello')
    console.log(this.cap)
  }

  render() {
    return (
      <>
        <p>Hello World</p>
      </>
    )
  }

}

export default Video
import React, { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'

let ocr: any;
export default function SpeechLayer(props: { socket: Socket, currentTestingDoc: number }) {

    const { latestTranscript } = useSpeechRecognition();

    
    useEffect(() => {
        import(`./sample/OCRs/${props.currentTestingDoc}.json`)
            .then(module => {
                ocr = module.default; // Get the exported data from the module object
                console.log(ocr); // log the parsed JSON data
            })
            .catch(error => {
                console.error(error); // log any errors
            });
    }, [])


    useEffect(() => {
        if (latestTranscript && latestTranscript !== '') {
            setTimeout(() => {
                console.log(latestTranscript);
            }, 500);
            const rawtext = ocr.textAnnotations[0].description
            // console.log(rawtext)
            const text = rawtext.replace(/(\r\n|\n|\r)/gm, " ")
            let query = `I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: ${rawtext}`;
            if (latestTranscript.toLowerCase().includes('flash') && latestTranscript.toLowerCase().includes('cards')) {
                props.socket.emit('flashcards', query)
            }else if(latestTranscript.toLowerCase().includes('important')){
                props.socket.emit('vocabulary', query)
            }else if(latestTranscript.toLowerCase().includes('statistics')){
                props.socket.emit('DocStats', query)
            }
        }
    }, [latestTranscript])

    return (
        <></>
    )
}
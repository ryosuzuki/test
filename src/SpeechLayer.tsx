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
            console.log(latestTranscript)
            props.socket.emit('detectActionQuery', latestTranscript)
        }
    }, [latestTranscript])

    useEffect(()=>{
        props.socket.on('detectActionResponse',(action)=>{
            if(action==='none'){
                return
            }
            console.log(action);
            action = JSON.parse(action)
            const rawtext = ocr.textAnnotations[0].description;
            let query = `I got this unstructured text from OCR. give me 1-3 sentence summary of what this is about. Raw text: ${rawtext}`;
            if(action['action']==='Phrase Vocabulary'){
                props.socket.emit('vocabulary', query)
            }else if(action['action']==='Statistics'){
                props.socket.emit('DocStats', query)
            }else if(action['action']==='Summary'){
                props.socket.emit('summary', query)
            }else if(action['action']==='Table of Contents'){
                props.socket.emit('hierarchy', query)
            }
        })
    },[])

    return (
        <></>
    )
}
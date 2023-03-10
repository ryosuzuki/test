import React, { useEffect, useState } from "react";
const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

var speechRecognizer: any;
var userLang: string;
var interimTimeout: any;

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    speechRecognizer = new SpeechRecognition();

    speechRecognizer.maxAlternatives = 100;
    speechRecognizer.continuous = true;

    userLang = (navigator as any).language || (navigator as any).userLanguage;
    console.log(userLang);

    const supportedlang = [
        "en-AU",
        "en-CA",
        "en-IN",
        "en-NZ",
        "en-ZA",
        "en-GB",
        "en-US",
    ];

    if (supportedlang.includes(userLang) === false) {
        console.log("found non supported language");
        userLang = "en-US";
    }

    interimTimeout = null;
}

export function useSpeechRecognition(){
    const [latestTranscript, setLatestTranscript] = useState<string>("");
    const [interimTranscript, setinterimTranscript] = useState<string>("");
    useEffect(()=>{
        speechRecognizer.start();
    },[]);
    speechRecognizer.onend = function () {
            speechRecognizer.start();
    };
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = userLang;
    }

    speechRecognizer.onresult = function (event: any) {
        for (var i = event.resultIndex; i <event.results.length; i++) {
            var transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                setLatestTranscript(transcript);
                setinterimTranscript('')
            }else{
                let newtemp = interimTranscript+transcript
                setinterimTranscript(newtemp)
            }
        }
    }

    return {latestTranscript, interimTranscript}
}
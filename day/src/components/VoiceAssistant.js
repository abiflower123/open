import React from "react";

const VoiceAssistant = ({ text }) => {
    const speak = () => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    };

    return <button onClick={speak}>Listen to Instructions</button>;
};

export default VoiceAssistant;

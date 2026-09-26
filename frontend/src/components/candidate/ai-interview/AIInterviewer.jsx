import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

import maleAvatar from "../../../assets/ai-interviewer-male.png";

const AIInterviewer = ({ question }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!question) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(question);

    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [question]);

  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">

      {/* Background Glow */}
      <div
        className={`absolute h-64 w-64 rounded-full blur-3xl transition-all duration-300 ${
          isSpeaking ? "bg-blue-500/20" : "bg-blue-600/10"
        }`}
      />

      {/* AI Interviewer */}
      <div className="relative flex flex-col items-center">

        {/* Male Avatar */}
        <div
          className={`flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 transition-all duration-300 ${
            isSpeaking
              ? "border-blue-500 shadow-2xl shadow-blue-500/30"
              : "border-slate-700"
          }`}
        >
          <img
            src={maleAvatar}
            alt="AI Interviewer"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Voice Animation */}
        <div className="mt-6 flex h-6 items-end gap-1.5">
          {[2, 4, 6, 4, 2].map((height, index) => (
            <span
              key={index}
              className={`w-2 rounded-full transition-all ${
                isSpeaking
                  ? `h-${height} animate-pulse bg-blue-400`
                  : "h-2 bg-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center gap-2">
          <Volume2
            className={`h-4 w-4 ${
              isSpeaking ? "text-blue-400" : "text-slate-500"
            }`}
          />

          <p className="text-sm font-medium text-slate-300">
            {isSpeaking
              ? "AI Interviewer is speaking..."
              : "AI Interviewer"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIInterviewer;
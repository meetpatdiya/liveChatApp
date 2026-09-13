import React, { useEffect, useRef, useState } from "react";
import api from "../ApiServices/Api.js";
import { useLocation } from "react-router-dom";
import { Mic, Trash, Send } from "lucide-react";

const VoiceMessage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");
  const [audioPreview, setAudioPreview] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const audioBlobRef = useRef(null);
  const cnvId = location.pathname.split("/")[2];

  const startRecording = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];
      setRecordingTime(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        clearInterval(timerRef.current);
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType,
        });

        audioBlobRef.current = audioBlob;

        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(previewUrl);

        audioChunksRef.current = [];
      };

      recorder.start();

      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Microphone permission is required.");
    }
  };

  const sendPreview = async () => {
    if (!audioBlobRef.current) return;

    await sendVoiceMessage(audioBlobRef.current);

    URL.revokeObjectURL(audioPreview);

    audioBlobRef.current = null;
    setAudioPreview(null);
    setRecordingTime(0);
  };
  const cancelPreview = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }

    audioBlobRef.current = null;
    setAudioPreview(null);
    setRecordingTime(0);
  };
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
  };

  const sendVoiceMessage = async (audioBlob) => {
    try {
      setIsSending(true);
      setError("");

      const formData = new FormData();

      formData.append("audio", audioBlob, "voice-message.webm");

      formData.append("cnvId", cnvId);
      formData.append("sndId", userId);

      const response = await api.post("/chat/voicemessage", formData);

      console.log("Voice message sent:", response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to send voice message.");
    } finally {
      setIsSending(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    clearInterval(timerRef.current);

    audioChunksRef.current = [];

    setIsRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex items-center">
      {!isRecording && !isSending && !audioPreview && (
        <button
          type="button"
          onClick={startRecording}
          className="text-slate-500 hover:text-emerald-600 transition"
          title="Record voice message"
        >
          <Mic size={22} />
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 bg-slate-100 rounded-full px-3 py-2">
          <button
            type="button"
            onClick={cancelRecording}
            className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition shrink-0"
            title="Cancel recording"
          >
            <Trash size={16} />
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-600 min-w-[110px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="font-medium tabular-nums">
              {formatTime(recordingTime)}
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Recording...
            </span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shrink-0"
            title="Send voice message"
          >
            <Send size={14} />
          </button>
        </div>
      )}

      {audioPreview && !isSending && (
        <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-2 pr-1.5 py-1.5">
          <button
            type="button"
            onClick={cancelPreview}
            className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition shrink-0"
            title="Delete recording"
          >
            <Trash size={16} />
          </button>

          <audio controls src={audioPreview} className="h-8 max-w-[180px]" />

          <button
            type="button"
            onClick={sendPreview}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shrink-0"
            title="Send voice message"
          >
            <Send size={14} />
          </button>
        </div>
      )}

      {isSending && (
        <div className="flex items-center gap-2 text-sm text-slate-400 px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sending...
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 px-2 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );

};

export default VoiceMessage;

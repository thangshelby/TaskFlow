import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Browser Speech-to-Text via Web Speech API (SpeechRecognition).
 *
 * Returns:
 *  - `isListening`   – whether the mic is currently active
 *  - `transcript`    – text recognised so far (accumulates across utterances)
 *  - `interimText`   – text currently being spoken (not yet finalised)
 *  - `isSupported`   – false when the browser has no SpeechRecognition API
 *  - `startListening`/ `stopListening` / `toggleListening`
 *  - `resetTranscript` – clear accumulated text
 */

// Extend Window to include vendor-prefixed SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ??
    w.webkitSpeechRecognition ??
    null) as SpeechRecognitionConstructor | null;
}

export interface UseSpeechToTextOptions {
  /** BCP-47 language tag, default "en-US" */
  lang?: string;
  /** Keep listening after each utterance? Default true */
  continuous?: boolean;
  /** Fire results while speaking? Default true */
  interimResults?: boolean;
  /** Called every time a **final** sentence is recognised */
  onResult?: (finalText: string) => void;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const {
    lang = "en-US",
    continuous = true,
    interimResults = true,
    onResult,
  } = options;

  const SpeechRecognitionAPI = getSpeechRecognition();
  const isSupported = !!SpeechRecognitionAPI;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);
  const stoppedManuallyRef = useRef(false);

  // Keep callback ref fresh
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    // Reuse or create
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang;
      recognition.interimResults = interimResults;
      recognition.continuous = continuous;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interim += text;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
          onResultRef.current?.(finalTranscript);
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        console.error("SpeechRecognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Auto-restart in continuous mode unless stopped manually
        if (!stoppedManuallyRef.current && continuous && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    stoppedManuallyRef.current = false;

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, [SpeechRecognitionAPI, lang, interimResults, continuous]);

  const stopListening = useCallback(() => {
    stoppedManuallyRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimText("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        stoppedManuallyRef.current = true;
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}


import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const LiveConsultation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<{role: string, text: string}[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startConsultation = async () => {
    if (isActive) return;
    setIsConnecting(true);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    audioContextRef.current = outputAudioContext;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.outputTranscription) {
              setTranscripts(prev => [...prev, {role: 'JurisAI', text: message.serverContent?.outputTranscription?.text || ''}]);
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: 'You are a professional legal consultant. Provide quick, accurate verbal briefings on legal topics. Be concise and authoritative.',
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopConsultation = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center">
        <div className="mb-8 relative">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 ${isActive ? 'bg-amber-500 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
            <i className={`fas ${isActive ? 'fa-microphone-lines' : 'fa-microphone-slash'}`}></i>
          </div>
          {isActive && (
            <div className="absolute -inset-4 rounded-full border-4 border-amber-200 animate-ping"></div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">Live Legal Briefing</h2>
        <p className="text-slate-500 mb-10 max-w-md">Immediate verbal consultation for quick legal clarifications, case summaries, or regulatory pulse checks.</p>

        {!isActive ? (
          <button
            onClick={startConsultation}
            disabled={isConnecting}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:bg-slate-400"
          >
            {isConnecting ? 'Connecting Secure Channel...' : 'Initiate Secure Voice Link'}
          </button>
        ) : (
          <button
            onClick={stopConsultation}
            className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
          >
            End Briefing Session
          </button>
        )}
      </div>

      <div className="mt-8 flex-1 bg-slate-900 rounded-3xl p-8 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            <i className="fas fa-list-ul text-amber-500"></i> Session Log
          </h3>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Encrypted End-to-End</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
          {transcripts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20">
              <i className="fas fa-terminal text-4xl mb-4"></i>
              <p className="text-sm font-mono">Awaiting transcription flux...</p>
            </div>
          ) : (
            transcripts.map((t, i) => (
              <div key={i} className="animate-slideUp">
                <p className="text-[10px] text-amber-500 font-bold uppercase mb-1">{t.role}</p>
                <p className="text-white/80 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveConsultation;

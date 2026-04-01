import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Play, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAudio, AnalysisResponse } from "@/api/modelApi";

export const PronunciationAssessment = ({
  lessonWord = "ॐ",
  romanization: lessonRoman = "om"
}: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWord, setCurrentWord] = useState(lessonWord);
  const [romanization, setRomanization] = useState(lessonRoman);
  const [feedback, setFeedback] = useState<AnalysisResponse | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const sampleWords = [
    { devanagari: "ॐ", roman: "Om" },
    { devanagari: "गुरु", roman: "Guru" },
    { devanagari: "योग", roman: "Yoga" },
    { devanagari: "धर्म", roman: "Dharma" },
  ];

  //  Convert WebM → WAV (CRITICAL for AI model)
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const bufferArray = new ArrayBuffer(44 + length);
    const view = new DataView(bufferArray);

    let offset = 0;

    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };

    writeString("RIFF");
    view.setUint32(offset, 36 + length, true);
    offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numOfChan, true);
    offset += 2;
    view.setUint32(offset, buffer.sampleRate, true);
    offset += 4;
    view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true);
    offset += 4;
    view.setUint16(offset, numOfChan * 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString("data");
    view.setUint32(offset, length, true);
    offset += 4;

    let index = 44;
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const channel = buffer.getChannelData(i);
      for (let j = 0; j < channel.length; j++) {
        view.setInt16(index, channel[j] * 0x7fff, true);
        index += 2;
      }
    }

    return new Blob([view], { type: "audio/wav" });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream); // WebM default
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const webmBlob = new Blob(chunks, { type: "audio/webm" });

          //  Convert WebM to WAV for AI model
          const arrayBuffer = await webmBlob.arrayBuffer();
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBlob = audioBufferToWav(audioBuffer);

          setAudioBlob(wavBlob);
          await assessPronunciation(wavBlob);
        } catch (err) {
          console.error("Audio conversion error:", err);
          toast({
            title: "Audio Error",
            description: "Failed to process recorded audio",
            variant: "destructive",
          });
        }

        stream.getTracks().forEach((track) => track.stop());

        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setFeedback(null);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 0.1);
      }, 100);

      toast({
        title: "Recording Started 🎙️",
        description: `Pronounce "${romanization}" clearly`,
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
      setAnalysisProgress(10);
    }
  };

  const assessPronunciation = async (blob: Blob) => {
    try {
      setAnalysisProgress(30);

      //  Send REAL WAV file to FastAPI
      const file = new File([blob], "recording.wav", {
        type: "audio/wav",
      });

      const result = await analyzeAudio(file, romanization.toLowerCase());

      setAnalysisProgress(100);
      setFeedback(result);
      setIsAnalyzing(false);

      toast({
        title: "AI Analysis Complete ",
        description: `Score: ${result.score}% | Transcription: ${result.transcription}`,
      });
    } catch (error) {
      console.error("AI Error:", error);
      setIsAnalyzing(false);
      toast({
        title: "Model Error",
        description: "Backend AI model is not responding.",
        variant: "destructive",
      });
    }
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const reset = () => {
    setFeedback(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setAnalysisProgress(0);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4"> AI Sanskrit Pronunciation Assessment</h2>

        <div className="text-6xl mb-2">{currentWord}</div>
        <div className="text-xl mb-6">{romanization}</div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="lg"
            className="w-24 h-24 rounded-full"
          >
            {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
          </Button>

          <Button onClick={playRecording} disabled={!audioBlob}>
            <Play className="mr-2" /> Play Recording
          </Button>

          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2" /> Reset
          </Button>
        </div>

        {isAnalyzing && (
          <div className="mb-4">
            <p className="mb-2"> Analyzing with AI Model...</p>
            <Progress value={analysisProgress} />
          </div>
        )}

        {feedback && (
          <div className="mt-6 text-left">
            <Badge className="mb-4 text-lg">
              Score: {feedback.score}% | Time: {recordingTime.toFixed(1)}s
            </Badge>

            <h3 className="text-xl font-semibold mb-2">Transcription:</h3>
            <p className="mb-4">{feedback.transcription || "No transcription"}</p>

            <h3 className="text-xl font-semibold mb-2">AI Tutor Feedback:</h3>

           <div className="mb-4 p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
            {feedback.overall_feedback}
         </div>

            <h3 className="text-xl font-semibold mb-2">Phoneme Analysis:</h3>
            <div className="grid grid-cols-2 gap-3">
              {feedback.phoneme_feedback?.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="text-lg">{p.phoneme}</span>
                  {p.classification === "CORRECT" ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <AlertCircle className="text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <audio ref={audioRef} className="hidden" />
      </Card>
    </div>
  );
};
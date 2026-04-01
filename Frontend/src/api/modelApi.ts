// Frontend/src/api/modelApi.ts

export interface AnalysisResponse {
  score: number;
  overall_feedback: string;
  transcription: string;
  phoneme_feedback: {
    phoneme: string;
    classification: string;
    error_type: string | null;
    details: any;
  }[];
}

const API_URL = "http://localhost:8000/analyze";

//  NOW SUPPORTS TARGET WORD (Tutor Mode)
export async function analyzeAudio(
  file: File,
  targetText: string
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("target_text", targetText); // CRITICAL

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze audio");
  }

  const data = await response.json();
  return data;
}
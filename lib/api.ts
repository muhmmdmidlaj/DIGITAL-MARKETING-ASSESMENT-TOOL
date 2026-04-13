const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export interface LeadData {
  name: string;
  mobile: string;
  profession: string;
}

export interface ScoreData {
  id: string;
  score: number;
  percentage: number;
  level: string;
}

export interface CreateLeadResponse {
  success: boolean;
  id: string;
}

export interface UpdateScoreResponse {
  success: boolean;
}

export async function createLead(data: LeadData): Promise<CreateLeadResponse> {
  if (!GAS_URL) {
    // Dev mode: return a mock ID
    const mockId = `DEV-${Date.now()}`;
    return { success: true, id: mockId };
  }

  const response = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "createLead", ...data }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit your information. Please try again.");
  }

  return response.json();
}

export async function updateScore(data: ScoreData): Promise<UpdateScoreResponse> {
  if (!GAS_URL) {
    return { success: true };
  }

  const response = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "updateScore", ...data }),
  });

  if (!response.ok) {
    throw new Error("Failed to save your score.");
  }

  return response.json();
}

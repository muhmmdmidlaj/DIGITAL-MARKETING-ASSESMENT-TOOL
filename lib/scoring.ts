export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface ScoreResult {
  score: number;
  total: number;
  percentage: number;
  level: Level;
  levelDescription: string;
  ctaText: string;
  ctaColor: string;
}

export function calculateScore(
  userAnswers: Record<number, number>,
  questions: Question[]
): ScoreResult {
  let score = 0;

  for (const question of questions) {
    if (userAnswers[question.id] === question.answer) {
      score++;
    }
  }

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  let level: Level;
  let levelDescription: string;
  let ctaText: string;
  let ctaColor: string;

  if (score <= 5) {
    level = "Beginner";
    levelDescription =
      "You're at the start of your digital marketing journey. Our beginner course will give you a strong foundation!";
    ctaText = "Enroll in Beginner Course";
    ctaColor = "#6366f1";
  } else if (score <= 10) {
    level = "Intermediate";
    levelDescription =
      "You have solid foundational knowledge. Personalized mentorship can accelerate your growth significantly!";
    ctaText = "Get Personal Mentorship";
    ctaColor = "#8b5cf6";
  } else {
    level = "Advanced";
    levelDescription =
      "Excellent! You have advanced knowledge. Our job-ready program will make you industry-ready!";
    ctaText = "Join Job-Ready Program";
    ctaColor = "#a855f7";
  }

  return { score, total, percentage, level, levelDescription, ctaText, ctaColor };
}

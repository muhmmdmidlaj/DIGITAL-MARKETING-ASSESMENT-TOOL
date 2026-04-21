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
  badge: string;
  headline: string;
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
  let badge: string;
  let headline: string;
  let levelDescription: string;
  let ctaText: string;
  let ctaColor: string;

  if (percentage <= 40) {
    level = "Beginner";
    badge = "Beginner Marketer";
    headline = "You've taken the first step — now let's build the real foundation.";
    levelDescription =
      "Most people in digital marketing started exactly where you are. The difference between where you are now and a job-ready, income-generating marketer is the right guidance — not years of trial and error. At HACA Marketing School, we'll take you from basics to job-ready in a structured, practical program built for real results.";
    ctaText = "Enroll in Beginner Course";
    ctaColor = "#6366f1";
  } else if (percentage <= 70) {
    level = "Intermediate";
    badge = "Intermediate Marketer";
    headline = "You know the basics. Here's what separates good marketers from great ones.";
    levelDescription =
      "You already understand how digital marketing works — that puts you ahead of most. But knowing theory and executing campaigns that drive real business results are two different things. HACA Marketing School's advanced modules will sharpen your skills in paid ads, SEO, content strategy, and analytics — so you can move from learning to earning faster.";
    ctaText = "Upgrade Your Skills";
    ctaColor = "#8b5cf6";
  } else {
    level = "Advanced";
    badge = "Advanced Marketer";
    headline = "Impressive. Now let's turn your skills into results — for your career or your business.";
    levelDescription =
      "You clearly have strong digital marketing knowledge. The next question is: are your skills translating into real growth — for your career or your business? Whether you're looking to land premium clients, scale your own brand, or move into a senior marketing role, HACA Marketing School's expert mentors can help you build the strategy and portfolio to get there.";
    ctaText = "Explore Advanced Program";
    ctaColor = "#a855f7";
  }

  return { score, total, percentage, level, badge, headline, levelDescription, ctaText, ctaColor };
}

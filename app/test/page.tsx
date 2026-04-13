"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import questions from "@/data/questions.json";
import { calculateScore } from "@/lib/scoring";
import { updateScore } from "@/lib/api";
import styles from "./page.module.css";

const TOTAL = questions.length;
const QUESTION_TIME = 60; // 1 minute per question

export default function TestPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [guardPassed, setGuardPassed] = useState(false);

  // Guard: must have a userId from the form
  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("lq_user_id");
    if (!id) {
      router.replace("/form");
    } else {
      setGuardPassed(true);
    }
  }, [router]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);
  const hasSubmitted = useRef(false);

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / TOTAL) * 100;
  const isLast = currentIndex === TOTAL - 1;
  const isAnswered = currentQ.id in answers;

  // Timer
  const handleSubmit = useCallback(async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setSubmitting(true);

    const userId = localStorage.getItem("lq_user_id") || "unknown";
    const result = calculateScore(answers, questions);

    try {
      await updateScore({
        id: userId,
        score: result.score,
        percentage: result.percentage,
        level: result.level,
      });
    } catch {
      // Don't block — still show results
    }

    // Store result for result page
    localStorage.setItem("lq_result", JSON.stringify(result));
    router.push("/result");
  }, [answers, router]);

  // Per-question timer: resets on each question, auto-advances when 0
  const autoAdvance = useCallback(() => {
    // Save current answer if selected, otherwise skip
    if (selected !== null) {
      setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: selected }));
    }
    if (currentIndex === TOTAL - 1) {
      handleSubmit();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(QUESTION_TIME);
    }
  }, [currentIndex, selected, handleSubmit]);

  useEffect(() => {
    if (!guardPassed) return;
    setTimeLeft(QUESTION_TIME);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          autoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [guardPassed, currentIndex, autoAdvance]);

  function selectOption(optionIndex: number) {
    if (submitting) return;
    setSelected(optionIndex);
  }

  function goNext() {
    if (selected === null && !isAnswered) return;

    const chosenAnswer = selected !== null ? selected : answers[currentQ.id];
    const newAnswers = { ...answers, [currentQ.id]: chosenAnswer };
    setAnswers(newAnswers);

    if (isLast) {
      handleSubmit();
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
  }

  // Pre-load saved answer when navigating (shouldn't happen in forward-only, but safe)
  useEffect(() => {
    const saved = answers[currentQ.id];
    setSelected(saved !== undefined ? saved : null);
  }, [currentIndex]); // eslint-disable-line

  if (!mounted || !guardPassed) {
    return (
      <div className={styles.loadingScreen}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <main className={styles.main}>


      <div className={styles.wrapper}>
        {/* ── Top bar ─────────────────────────── */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.logo}>
              <span className="gradient-text">DM Assessment</span>
            </div>
            <span className={styles.topBarSep} />
            <span className={styles.topBarLabel}>Digital Marketing Assessment</span>
          </div>

          <div className={`${styles.timer} ${timeLeft <= 10 ? styles.timerDanger : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            0:{timeLeft.toString().padStart(2, "0")}
          </div>
        </header>

        {/* ── Progress ─────────────────────────── */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabels}>
            <span className={styles.progressText}>Question {currentIndex + 1} of {TOTAL}</span>
            <span className={styles.progressPct}>{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {/* Question dots */}
          <div className={styles.dots}>
            {questions.map((q, i) => (
              <div
                key={i}
                className={`${styles.dot} ${
                  q.id in answers ? styles.dotAnswered :
                  i === currentIndex ? styles.dotCurrent : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Question Card ─────────────────────── */}
        <div className={`${styles.questionCard} glass-card fade-up`} key={currentIndex}>
          <div className={styles.qNumber}>Q{currentIndex + 1}</div>
          <h2 className={styles.qText}>{currentQ.question}</h2>

          <div className={styles.options}>
            {currentQ.options.map((opt, i) => {
              const isActive = selected === i || (selected === null && answers[currentQ.id] === i);
              return (
                <button
                  key={i}
                  id={`option-${i}`}
                  className={`${styles.option} ${isActive ? styles.optionSelected : ""}`}
                  onClick={() => selectOption(i)}
                  disabled={submitting}
                >
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={styles.optionText}>{opt}</span>
                  {isActive && (
                    <span className={styles.optionCheck}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next / Submit — only shows after selecting an answer */}
          {(selected !== null) && (
            <div className={`${styles.navRow} fade-up`}>
              <span />
              <button
                id={isLast ? "submit-test" : "next-question"}
                className="btn-primary"
                onClick={goNext}
                disabled={submitting}
              >
                {submitting ? (
                  <><div className="spinner" />Submitting…</>
                ) : isLast ? (
                  <>Submit & See Results
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </>
                ) : (
                  <>Next Question
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

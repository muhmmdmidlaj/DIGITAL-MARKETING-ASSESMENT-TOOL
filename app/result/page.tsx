"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ScoreResult } from "@/lib/scoring";
import styles from "./page.module.css";

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

const levelConfig: Record<string, { color: string; emoji: string; ring: string }> = {
  Beginner: {
    emoji: "🌱",
    color: "#6366f1",
    ring: "rgba(99,102,241,0.3)",
  },
  Intermediate: {
    emoji: "🚀",
    color: "#8b5cf6",
    ring: "rgba(139,92,246,0.3)",
  },
  Advanced: {
    emoji: "⭐",
    color: "#a855f7",
    ring: "rgba(168,85,247,0.3)",
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("there");
  const svgRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("lq_result");
    const name = localStorage.getItem("lq_user_name");
    if (!raw) {
      router.replace("/form");
      return;
    }
    setResult(JSON.parse(raw));
    if (name) setUserName(name.split(" ")[0]);
  }, [router]);

  const animatedScore = useCountUp(result?.score ?? 0, 1000);
  const animatedPct = useCountUp(result?.percentage ?? 0, 1200);

  // SVG ring animation
  useEffect(() => {
    if (!result || !svgRef.current) return;
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference - (result.percentage / 100) * circumference;
    svgRef.current.style.strokeDasharray = `${circumference}`;
    svgRef.current.style.strokeDashoffset = `${circumference}`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (svgRef.current) {
          svgRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
          svgRef.current.style.strokeDashoffset = `${dashOffset}`;
        }
      }, 100);
    });
  }, [result]);

  function retakeTest() {
    localStorage.removeItem("lq_result");
    localStorage.removeItem("lq_user_id");
    localStorage.removeItem("lq_user_name");
    router.push("/form");
  }

  if (!mounted || !result) {
    return (
      <div className={styles.loadingScreen}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  const cfg = levelConfig[result.level];
  const badgeClass =
    result.level === "Beginner"
      ? "badge-beginner"
      : result.level === "Intermediate"
      ? "badge-intermediate"
      : "badge-advanced";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* ── Confetti-style header ─────────────── */}
        <div className={`${styles.header} fade-up`}>
          <div className={styles.emoji}>{cfg.emoji}</div>
          <h1 className={styles.heading}>
            Great job, <span className="gradient-text">{userName}!</span>
          </h1>
          <p className={styles.subheading}>
            You&apos;ve completed the Digital Marketing Assessment. Here are your results.
          </p>
        </div>

        {/* ── Main result card ──────────────────── */}
        <div className={`${styles.resultCard} glass-card fade-up fade-up-delay-1`}>
          {/* Ring + Score */}
          <div className={styles.scoreSection}>
            <div className={styles.ringWrap}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                {/* Track */}
                <circle
                  cx="65" cy="65" r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />
                {/* Progress */}
                <circle
                  ref={svgRef}
                  cx="65" cy="65" r="54"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.ringCenter}>
                <span className={styles.pctVal}>{animatedPct}%</span>
                <span className={styles.pctLabel}>Score</span>
              </div>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.scoreBig}>
                <span className={styles.scoreNum}>{animatedScore}</span>
                <span className={styles.scoreOf}>/{result.total}</span>
              </div>
              <p className={styles.scoreSubtitle}>Correct answers</p>

              <div className={`badge ${badgeClass}`} style={{ marginTop: 8 }}>
                {cfg.emoji} {result.level}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Level description */}
          <div className={styles.levelDesc}>
            <p>{result.levelDescription}</p>
          </div>




          {/* Performance breakdown */}
          <div className={styles.breakdown}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownVal} style={{ color: "#10b981" }}>
                {result.score}
              </span>
              <span className={styles.breakdownLabel}>Correct</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownVal} style={{ color: "#ef4444" }}>
                {result.total - result.score}
              </span>
              <span className={styles.breakdownLabel}>Incorrect</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownVal} style={{ color: "#6366f1" }}>
                {result.total}
              </span>
              <span className={styles.breakdownLabel}>Total</span>
            </div>
          </div>
        </div>

        {/* ── Level map ─────────────────────────── */}
        <div className={`${styles.levelMap} glass-card fade-up fade-up-delay-2`}>
          <h3 className={styles.levelMapTitle}>Skill Level Breakdown</h3>
          <div className={styles.levelBars}>
            {[
              { label: "Beginner", range: "0–5", pct: 33, color: "#6366f1" },
              { label: "Intermediate", range: "6–10", pct: 67, color: "#8b5cf6" },
              { label: "Advanced", range: "11–15", pct: 100, color: "#a855f7" },
            ].map((l) => (
              <div key={l.label} className={styles.levelBar}>
                <div className={styles.levelBarMeta}>
                  <span className={`${styles.levelBarLabel} ${result.level === l.label ? styles.levelBarActive : ""}`}>
                    {result.level === l.label && "→ "}{l.label}
                  </span>
                  <span className={styles.levelBarRange}>{l.range} / 15</span>
                </div>
                <div className={styles.levelBarTrack}>
                  <div
                    className={styles.levelBarFill}
                    style={{
                      width: `${l.pct}%`,
                      background: l.color,
                      opacity: result.level === l.label ? 1 : 0.3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ───────────────────────────── */}
        <div className={`${styles.actions} fade-up fade-up-delay-3`}>
          <button className="btn-secondary" onClick={retakeTest}>
            🔄 Retake Assessment
          </button>
          <Link href="/" className="btn-secondary" id="back-home-result">
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

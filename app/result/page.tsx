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
    emoji: "🟡",
    color: "#6366f1",
    ring: "rgba(99,102,241,0.3)",
  },
  Intermediate: {
    emoji: "🔵",
    color: "#8b5cf6",
    ring: "rgba(139,92,246,0.3)",
  },
  Advanced: {
    emoji: "🟢",
    color: "#a855f7",
    ring: "rgba(168,85,247,0.3)",
  },
};

/* ── CTA content per level & profession ─────────────── */
interface CTAConfig {
  cta1: { icon: string; title: string; desc: string; btn: string; link: string };
  cta2: { icon: string; title: string; desc: string; btn: string; link: string };
}

function getCTAs(level: string, profession: string): CTAConfig {
  const isBusinessOwner = profession === "Business Owner";
  const isJobSeeker = profession === "Job Seeker";
  const isFreelancer = profession === "Freelancer";

  if (level === "Beginner") {
    return {
      cta1: {
        icon: "🎓",
        title: "Join HACA Marketing School",
        desc: "Start your digital marketing journey with expert mentors and live projects.",
        btn: "Enroll Now",
        link: "#enroll",
      },
      cta2: isBusinessOwner
        ? {
            icon: "📞",
            title: "Get a Free Business Marketing Consultation",
            desc: "Let our experts show you how to attract customers and grow your business online — completely free.",
            btn: "Book a Free Business Call",
            link: "#counselling",
          }
        : isJobSeeker
        ? {
            icon: "📞",
            title: "Get Career Guidance from Our Counsellors",
            desc: "We'll help you identify the right digital marketing career path and map out a plan to get there — for free.",
            btn: "Book a Free Career Call",
            link: "#counselling",
          }
        : isFreelancer
        ? {
            icon: "📞",
            title: "Start Landing Freelance Clients Faster",
            desc: "Our counsellors will help you build the skills and strategy to win your first (or next) freelance clients — free.",
            btn: "Book a Free Freelancer Call",
            link: "#counselling",
          }
        : {
            icon: "📞",
            title: "Not sure where to start?",
            desc: "Talk to our career counsellors for free — we'll map out your personal learning path.",
            btn: "Book a Free Counselling Call",
            link: "#counselling",
          },
    };
  }

  if (level === "Intermediate") {
    return {
      cta1: {
        icon: "🚀",
        title: "Level Up at HACA Marketing School",
        desc: "Master advanced tools, live campaigns, and industry certifications.",
        btn: "Upgrade Your Skills Now",
        link: "#enroll",
      },
      cta2: isBusinessOwner
        ? {
            icon: "📈",
            title: "Scale Your Business with Expert Guidance",
            desc: "Our consultants will review your current marketing efforts and show you what to fix — one free call.",
            btn: "Book a Free Growth Call",
            link: "#counselling",
          }
        : isJobSeeker
        ? {
            icon: "💼",
            title: "Get Closer to Your Dream Marketing Job",
            desc: "Our experts will review your score and suggest a focused learning path to make you job-ready — completely free.",
            btn: "Talk to a Career Expert",
            link: "#counselling",
          }
        : isFreelancer
        ? {
            icon: "💡",
            title: "Win Higher-Paying Freelance Projects",
            desc: "Our experts will review your skills and help you position yourself for premium clients — free consultation.",
            btn: "Talk to a Freelance Coach",
            link: "#counselling",
          }
        : {
            icon: "🎯",
            title: "Want to know exactly what to learn next?",
            desc: "Our experts will review your score and suggest a focused learning path — completely free.",
            btn: "Talk to a Counsellor",
            link: "#counselling",
          },
    };
  }

  // Advanced
  return {
    cta1: {
      icon: "⭐",
      title: "Be a Pro with HACA Marketing School",
      desc: "Strategy, leadership, and advanced specialisations for marketers who are ready to scale.",
      btn: "Explore Advanced Program",
      link: "#enroll",
    },
    cta2: isBusinessOwner
      ? {
          icon: "📈",
          title: "Running a business? Let\u2019s talk growth.",
          desc: "Our consultants will show you exactly how to use digital marketing to scale — one free call.",
          btn: "Book a Free Strategy Call",
          link: "#counselling",
        }
      : isJobSeeker
      ? {
          icon: "🏆",
          title: "Ready for a Senior Marketing Role?",
          desc: "Our mentors will help you build the portfolio and strategy to land premium positions — free.",
          btn: "Book a Free Career Strategy Call",
          link: "#counselling",
        }
      : isFreelancer
      ? {
          icon: "💎",
          title: "Scale Your Freelance Business",
          desc: "Our experts will help you move from freelancer to agency-level — strategy session, completely free.",
          btn: "Book a Free Scaling Call",
          link: "#counselling",
        }
      : {
          icon: "📈",
          title: "Running a business? Let\u2019s talk growth.",
          desc: "Our consultants will show you exactly how to use digital marketing to scale — one free call.",
          btn: "Book a Free Strategy Call",
          link: "#counselling",
        },
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("there");
  const [profession, setProfession] = useState("Student");
  const [showThankYou, setShowThankYou] = useState(false);
  const svgRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("lq_result");
    const name = localStorage.getItem("lq_user_name");
    const prof = localStorage.getItem("lq_user_profession");
    if (!raw) {
      router.replace("/form");
      return;
    }
    setResult(JSON.parse(raw));
    if (name) setUserName(name.split(" ")[0]);
    if (prof) setProfession(prof);
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
    localStorage.removeItem("lq_user_profession");
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

  const ctas = getCTAs(result.level, profession);

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
                {cfg.emoji} {result.badge}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Level headline & description */}
          <div className={styles.levelDesc}>
            <h2 className={styles.levelHeadline}>{result.headline}</h2>
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

        {/* ── CTA Cards ────────────────────────────── */}
        <div className={`${styles.ctaSection} fade-up fade-up-delay-2`}>
          {/* CTA 1 — Enrollment */}
          <div className={`${styles.ctaCard} glass-card`}>
            <div className={styles.ctaIcon}>{ctas.cta1.icon}</div>
            <h3 className={styles.ctaTitle}>{ctas.cta1.title}</h3>
            <p className={styles.ctaDesc}>{ctas.cta1.desc}</p>
            <button
              className="btn-primary"
              id="cta-enroll"
              style={{ width: "100%" }}
              onClick={() => setShowThankYou(true)}
            >
              {ctas.cta1.btn}
            </button>
          </div>

          {/* CTA 2 — Counselling */}
          <div className={`${styles.ctaCard} glass-card`}>
            <div className={styles.ctaIcon}>{ctas.cta2.icon}</div>
            <h3 className={styles.ctaTitle}>{ctas.cta2.title}</h3>
            <p className={styles.ctaDesc}>{ctas.cta2.desc}</p>
            <button
              className={`btn-primary ${styles.ctaSecondaryBtn}`}
              id="cta-counselling"
              style={{ width: "100%" }}
              onClick={() => setShowThankYou(true)}
            >
              {ctas.cta2.btn}
            </button>
          </div>
        </div>

        {/* ── Level map ─────────────────────────── */}
        <div className={`${styles.levelMap} glass-card fade-up fade-up-delay-3`}>
          <h3 className={styles.levelMapTitle}>Skill Level Breakdown</h3>
          <div className={styles.levelBars}>
            {[
              { label: "Beginner", range: "0–40%", pct: 40, color: "#6366f1" },
              { label: "Intermediate", range: "41–70%", pct: 70, color: "#8b5cf6" },
              { label: "Advanced", range: "71–100%", pct: 100, color: "#a855f7" },
            ].map((l) => (
              <div key={l.label} className={styles.levelBar}>
                <div className={styles.levelBarMeta}>
                  <span className={`${styles.levelBarLabel} ${result.level === l.label ? styles.levelBarActive : ""}`}>
                    {result.level === l.label && "→ "}{l.label}
                  </span>
                  <span className={styles.levelBarRange}>{l.range}</span>
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

        {/* ── Universal Footer ──────────────────── */}
        <div className={`${styles.universalFooter} fade-up fade-up-delay-4`}>
          <div className={styles.footerTrust}>
            <span className={styles.footerTrustIcon}>✅</span>
            <span>Trusted by <strong>2000+</strong> students and business owners across Kerala</span>
          </div>
        </div>

        {/* ── Actions ───────────────────────────── */}
        <div className={`${styles.actions} fade-up fade-up-delay-4`}>
          <button className="btn-secondary" onClick={retakeTest}>
            🔄 Retake Assessment
          </button>
          <Link href="/" className="btn-secondary" id="back-home-result">
            🏠 Back to Home
          </Link>
        </div>
      </div>

      {/* ── Thank You Modal ────────────────────── */}
      {showThankYou && (
        <div className={styles.modalOverlay} onClick={() => setShowThankYou(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowThankYou(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className={styles.modalEmoji}>🎉</div>
            <h2 className={styles.modalHeadline}>
              Thank You! We&apos;ve Received Your Request 🎉
            </h2>
            <p className={styles.modalMessage}>
              Our team at <strong>HACA Marketing School</strong> will reach out to you within{" "}
              <strong>24 hours</strong> to schedule your free call.
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowThankYou(false)}
              style={{ marginTop: 12 }}
            >
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

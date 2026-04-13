"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <main className={styles.main}>
      {/* ── Hero ────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.pill} fade-up`}>
            <span className={styles.pillDot} />
            100% Free · No login required
          </div>

          <h1 className={`${styles.heroTitle} fade-up fade-up-delay-1`}>
            <span className="gradient-text">Digital Marketing</span>
            <br />
            Assessment Test
          </h1>

          <p className={`${styles.heroSub} fade-up fade-up-delay-2`}>
            15 questions · Instant score · Discover your skill level
          </p>

          <div className={`${styles.heroCta} fade-up fade-up-delay-3`}>
            <Link href="/form" className="btn-primary" id="cta-start">
              Start Free Assessment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p className={styles.heroNote}>⏱ Takes only 10–15 minutes</p>
          </div>

          {/* Stats row */}
          <div className={`${styles.statsRow} fade-up fade-up-delay-4`}>
            {[
              { val: "15", label: "Questions" },
              { val: "3", label: "Skill Levels" },
              { val: "100%", label: "Free" },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statVal}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grid lines */}
        <div className={styles.gridLines} aria-hidden="true" />
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Digital Marketing Assessment Test</p>
      </footer>
    </main>
  );
}

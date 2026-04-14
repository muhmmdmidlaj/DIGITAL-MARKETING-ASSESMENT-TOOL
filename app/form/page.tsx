"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLead } from "@/lib/api";
import styles from "./page.module.css";

const professions = [
  "Student",
  "Job Seeker",
  "Freelancer",
  "Marketing Professional",
  "Business Owner",
  "Software Developer",
  "Content Creator",
  "Other",
];

const countryCodes = [
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+966", flag: "🇸🇦", label: "Saudi" },
  { code: "+974", flag: "🇶🇦", label: "Qatar" },
  { code: "+968", flag: "🇴🇲", label: "Oman" },
  { code: "+965", flag: "🇰🇼", label: "Kuwait" },
  { code: "+973", flag: "🇧🇭", label: "Bahrain" },
  { code: "+61", flag: "🇦🇺", label: "Australia" },
  { code: "+65", flag: "🇸🇬", label: "Singapore" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia" },
  { code: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "+33", flag: "🇫🇷", label: "France" },
  { code: "+81", flag: "🇯🇵", label: "Japan" },
];

interface FormErrors {
  name?: string;
  mobile?: string;
  profession?: string;
}

export default function FormPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [profession, setProfession] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim() || name.trim().length < 2)
      e.name = "Please enter your full name (at least 2 characters).";
    const trimmedMobile = mobile.trim();
    if (!trimmedMobile) {
      e.mobile = "Enter a valid mobile number.";
    } else if (countryCode === "+91") {
      if (trimmedMobile.length !== 10)
        e.mobile = "Indian mobile number must be exactly 10 digits.";
      else if (!/^[6-9]/.test(trimmedMobile))
        e.mobile = "Indian mobile number must start with 6, 7, 8, or 9.";
    } else if (trimmedMobile.length < 7 || trimmedMobile.length > 15) {
      e.mobile = "Enter a valid mobile number.";
    }
    if (!profession)
      e.profession = "Please select your profession.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await createLead({
        name: name.trim(),
        mobile: `${countryCode.replace("+", "")} ${mobile.trim()}`,
        profession,
      });
      localStorage.setItem("lq_user_id", res.id);
      localStorage.setItem("lq_user_name", name.trim());
      router.push("/test");
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back link */}
        <a href="/" className={styles.backLink} id="back-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>

        <div className={`${styles.card} glass-card fade-up`}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.stepBadge}>Step 1 of 3</div>
            <h1 className={styles.title}>Tell us about yourself</h1>
            <p className={styles.subtitle}>
              We&apos;ll personalise your assessment results based on your profile.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className={`input-field ${errors.name ? "error" : ""}`}
                placeholder="e.g. Muhammed Midlaj"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label className="label" htmlFor="mobile">Mobile Number</label>
              <div className={styles.mobileWrap}>
                <select
                  id="country-code"
                  className={`${styles.countryCode} ${styles.countrySelect}`}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={loading}
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>
                      {cc.flag} {cc.code}
                    </option>
                  ))}
                </select>
                <input
                  id="mobile"
                  type="tel"
                  className={`input-field ${errors.mobile ? "error" : ""}`}
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  maxLength={15}
                  disabled={loading}
                  autoComplete="tel"
                />
              </div>
              {errors.mobile && <p className="form-error">{errors.mobile}</p>}
            </div>

            {/* Profession */}
            <div className="form-group">
              <label className="label" htmlFor="profession">Profession</label>
              <select
                id="profession"
                className={`input-field ${styles.select} ${errors.profession ? "error" : ""}`}
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>Select your profession</option>
                {professions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.profession && <p className="form-error">{errors.profession}</p>}
            </div>

            {/* API error */}
            {apiError && (
              <div className={styles.apiError}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="submit-form"
              style={{ width: "100%", marginTop: 8 }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Saving your details…
                </>
              ) : (
                <>
                  Continue to Assessment
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Trust signals */}
          <div className={styles.trustRow}>
            <span>🔒 Your data is private</span>
            <span>·</span>
            <span>No spam, ever</span>
            <span>·</span>
            <span>Free forever</span>
          </div>
        </div>

        {/* Side info */}
        <div className={`${styles.sideInfo} fade-up fade-up-delay-2`}>
          <div className={`${styles.infoCard} glass-card`}>
            <h3 className={styles.infoTitle}>What happens next?</h3>
            <div className={styles.infoSteps}>
              {[
                { icon: "📋", text: "15 MCQ questions about digital marketing" },
                { icon: "⏱️", text: "1 minute per question — stay sharp!" },
                { icon: "📊", text: "Instant score with skill-level badge" },
                { icon: "🎯", text: "Personalised CTA based on your level" },
              ].map((item) => (
                <div key={item.text} className={styles.infoStep}>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <span className={styles.infoText}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

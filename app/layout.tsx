import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Marketing Assessment Test – Free Online Quiz",
  description:
    "Test your digital marketing knowledge with our free 15-question assessment. Get instant results, discover your skill level, and unlock your personalized learning path.",
  keywords: "digital marketing, assessment, quiz, SEO, online marketing, lead generation",
  openGraph: {
    title: "Digital Marketing Assessment Test – Free Online Quiz",
    description:
      "Discover your digital marketing skill level in just 15 questions. Take the free assessment now!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="noise" aria-hidden="true" />
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

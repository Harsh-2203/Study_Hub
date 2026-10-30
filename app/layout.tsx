import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyHub | An AI-Powered Learning Experience",
  description: "Explore StudyHub, an AI-powered learning platform developed by Sarah Pardeshi, bringing AI-generated study guides, interactive quizzes, and learning resources together.",
  openGraph: { title: "StudyHub | An AI-Powered Learning Experience", description: "Turn curiosity into structured learning with StudyHub.", type: "website" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Sarah Pardeshi | AI, Software & Selected Work",
  description: "Sarah Pardeshi is a Computer Science undergraduate interested in AI, machine learning, and building practical software. Explore StudyHub and selected projects.",
  openGraph: { title: "Sarah Pardeshi | AI, Software & Selected Work", description: "A portfolio of AI, software, and learning projects by Sarah Pardeshi.", type: "website" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

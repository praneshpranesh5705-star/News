import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TamilNadu AI News",
  description: "Tamil Nadu news in Tamil and English with AI summaries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ta"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAV HAIR",
  description: "시간이 증명한 신뢰, 페이브 헤어",
  icons: {
    icon: "/assets/favhair-mark.png",
    shortcut: "/assets/favhair-mark.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

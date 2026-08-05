import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://favhair.co.kr"),
  title: {
    default: "페이브헤어 | 평내호평 미용실",
    template: "%s | 페이브헤어",
  },
  description: "한 자리에서 17년, 남양주 평내호평역 헤어살롱 페이브헤어.",
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

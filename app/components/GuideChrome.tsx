import type { ReactNode } from "react";
import { BOOKING_URL, PHONE_HREF } from "../lib/guides";
import Link from "next/link";

const INLINE_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

// 문장 안의 [글자](주소)를 링크로 바꾼다. 바깥 주소는 새 창으로 연다.
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const [whole, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));
    nodes.push(
      href.startsWith("/") ? (
        <Link key={index} href={href}>{label}</Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noreferrer">{label}</a>
      ),
    );
    lastIndex = index + whole.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function GuideHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="FAV HAIR 홈">
        <img src="/assets/favhair-wordmark-transparent.png" alt="FAV HAIR" />
      </Link>
      <nav className="desktop-nav" aria-label="주요 메뉴">
        <Link href="/#story">Brand</Link>
        <Link href="/#team">Artists</Link>
        <Link href="/#style">Style</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/#visit">Visit</Link>
      </nav>
      <a className="header-booking" href={BOOKING_URL} target="_blank" rel="noreferrer">
        예약하기 <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}

export function GuideFooter() {
  return (
    <>
      <footer>
        <div className="footer-mark">FAV HAIR</div>
        <p>TIME BUILDS TRUST.</p>
        <div className="footer-bottom">
          <span>© 2026 FAV HAIR</span>
          <Link href="/">FAV HAIR 홈 ↗</Link>
        </div>
      </footer>
      <nav className="mobile-actions" aria-label="빠른 메뉴">
        <a href={PHONE_HREF}>전화</a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer">네이버 예약</a>
      </nav>
    </>
  );
}

import type { Metadata } from "next";
import { GuideFooter, GuideHeader } from "../components/GuideChrome";
import { BOOKING_URL, SITE_URL, guides } from "../lib/guides";

const PAGE_URL = `${SITE_URL}/guide`;
const DESCRIPTION =
  "남양주 호평동 미용실 페이브헤어가 정리한 헤어 가이드. 펌과 염색 후 관리, 볼륨매직과 매직세팅펌 차이, 다운펌 주기, 레이어드컷, 평내호평역에서 오시는 길과 주차를 안내합니다.";

export const metadata: Metadata = {
  title: { absolute: "헤어 가이드 | 호평동 미용실 페이브헤어" },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "헤어 가이드 | 호평동 미용실 페이브헤어",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "페이브헤어 FAV HAIR",
    locale: "ko_KR",
    type: "website",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "페이브헤어 FAV HAIR" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "페이브헤어 헤어 가이드",
  url: PAGE_URL,
  description: DESCRIPTION,
  inLanguage: "ko-KR",
  hasPart: guides.map((guide) => ({
    "@type": "Article",
    headline: guide.title,
    url: `${SITE_URL}/guide/${guide.slug}`,
  })),
};

export default function GuideIndex() {
  return (
    <main className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideHeader />
      <section className="guide-index-hero section-shell">
        <p className="guide-eyebrow">FAV HAIR · HAIR GUIDE</p>
        <h1>호평동 미용실 페이브헤어 헤어 가이드</h1>
        <p className="guide-lead">
          미용실을 나선 뒤의 아침이 편하도록, 시술을 고르는 기준과 집에서 손질하는 순서를 적어 둡니다.
          남양주 호평동, 평내호평역 1번 출구 앞 페이브헤어가 상담에서 자주 드리는 이야기입니다.
        </p>
      </section>
      <section className="guide-index-list section-shell" aria-label="가이드 목록">
        {guides.map((guide, index) => (
          <a className="guide-card" key={guide.slug} href={`/guide/${guide.slug}`}>
            <span className="guide-card-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="guide-card-body">
              <small>{guide.category}</small>
              <strong>{guide.title}</strong>
              <span>{guide.lead}</span>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        ))}
      </section>
      <section className="section-shell guide-cta">
        <a className="booking-banner" href={BOOKING_URL} target="_blank" rel="noreferrer">
          <span>
            <small>ONLINE RESERVATION</small>
            어떤 시술이 맞을지 모르겠다면, 상담부터 예약하세요.
          </span>
          <strong aria-hidden="true">↗</strong>
        </a>
      </section>
      <GuideFooter />
    </main>
  );
}

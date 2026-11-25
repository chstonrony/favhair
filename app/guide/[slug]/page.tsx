import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideFooter, GuideHeader, renderInline } from "../../components/GuideChrome";
import { BOOKING_URL, MAP_URL, SITE_URL, getGuide, guides, type GuideBlock } from "../../lib/guides";
import Link from "next/link";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = `${SITE_URL}/guide/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: "페이브헤어 FAV HAIR",
      locale: "ko_KR",
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      images: [{ url: `${SITE_URL}${guide.image.src}`, alt: guide.image.alt }],
    },
  };
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function Block({ block }: { block: GuideBlock }) {
  if (block.type === "p") return <p>{renderInline(block.text)}</p>;
  if (block.type === "note") return <p className="guide-note">{renderInline(block.text)}</p>;
  if (block.type === "list") {
    const items = block.items.map((item) => <li key={item}>{renderInline(item)}</li>);
    return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
  }
  return (
    <div className="guide-table-wrap">
      <table>
        <thead>
          <tr>{block.head.map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) =>
                index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guide/${guide.slug}`;
  const related = guide.related.map(getGuide).filter((item) => item !== undefined);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      image: `${SITE_URL}${guide.image.src}`,
      datePublished: guide.published,
      dateModified: guide.updated,
      inLanguage: "ko-KR",
      mainEntityOfPage: url,
      author: { "@type": "HairSalon", "@id": `${SITE_URL}/#salon`, name: "페이브헤어", url: `${SITE_URL}/` },
      publisher: {
        "@type": "Organization",
        name: "페이브헤어",
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "페이브헤어", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "헤어 가이드", item: `${SITE_URL}/guide` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <main className="guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideHeader />
      <article className="guide-article">
        <header className="guide-hero section-shell">
          <nav className="guide-breadcrumb" aria-label="현재 위치">
            <Link href="/">페이브헤어</Link>
            <span aria-hidden="true">/</span>
            <Link href="/guide">헤어 가이드</Link>
          </nav>
          <p className="guide-eyebrow">{guide.category} · 호평동 미용실 페이브헤어</p>
          <h1>{guide.title}</h1>
          <p className="guide-lead">{guide.lead}</p>
          <p className="guide-meta">
            <span>페이브헤어</span>
            <time dateTime={guide.updated}>{formatDate(guide.updated)} 고침</time>
          </p>
        </header>

        <figure className="guide-figure section-shell">
          <img src={guide.image.src} alt={guide.image.alt} width={1600} height={1200} />
        </figure>

        <div className="guide-body">
          <aside className="guide-summary" aria-label="핵심 요약">
            <p>먼저 읽는 요약</p>
            <ul>
              {guide.summary.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </aside>

          {guide.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <p className="guide-section-label">{section.label}</p>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, index) => <Block key={index} block={block} />)}
            </section>
          ))}

          <section id="faq" className="guide-faq">
            <p className="guide-section-label">FAQ</p>
            <h2>자주 묻는 질문</h2>
            <dl>
              {guide.faq.map((item) => (
                <div key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {guide.sources.length > 0 && (
            <section className="guide-sources" aria-label="참고 자료">
              <p className="guide-section-label">REFERENCES</p>
              <ul>
                {guide.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                  </li>
                ))}
              </ul>
              <p>모발과 두피 상태는 사람마다 다릅니다. 이 글은 일반적인 안내이며, 시술 뒤에 디자이너에게 들은 안내가 있다면 그 안내를 먼저 따라 주세요.</p>
            </section>
          )}

          <section className="guide-visit" aria-label="페이브헤어 위치와 예약">
            <p className="guide-section-label">VISIT FAV</p>
            <p>
              페이브헤어는 경기 남양주시 늘을2로 26 메인시네마타워 203-1호, 평내호평역 1번 출구에서 254m 거리에 있습니다.
              영업시간은 매일 10:00~19:00입니다.
            </p>
            <div className="link-row">
              <a href={BOOKING_URL} target="_blank" rel="noreferrer">네이버 예약 ↗</a>
              <a href={MAP_URL} target="_blank" rel="noreferrer">네이버 지도 ↗</a>
              {guide.slug !== "visit-parking-booking" && <Link href="/guide/visit-parking-booking">오시는 길과 주차 ↘</Link>}
            </div>
          </section>
        </div>
      </article>

      <section className="guide-related section-shell" aria-label="함께 읽으면 좋은 가이드">
        <p className="guide-section-label">READ NEXT</p>
        <div className="guide-index-list">
          {related.map((item) => (
            <Link className="guide-card" key={item.slug} href={`/guide/${item.slug}`}>
              <span className="guide-card-body">
                <small>{item.category}</small>
                <strong>{item.title}</strong>
              </span>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>
      <GuideFooter />
    </main>
  );
}

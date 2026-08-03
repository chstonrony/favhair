import type { Metadata } from "next";
import { headers } from "next/headers";

const BOOKING_URL = "https://m.place.naver.com/hairshop/12857507/stylist";
const REVIEW_URL = "https://m.place.naver.com/hairshop/12857507/review/visitor";
const KAKAO_URL = "https://pf.kakao.com/_xmxmhen";

const styles = [
  { src: "/assets/style-01.png", alt: "소프트 브라운 레이어드 C컬", name: "소프트 브라운 레이어드", english: "SOFT BROWN LAYERED" },
  { src: "/assets/style-02.png", alt: "코퍼 오렌지 레이어드 컷", name: "코퍼 오렌지 레이어드", english: "COPPER ORANGE LAYERED" },
  { src: "/assets/style-03.png", alt: "내추럴 롱 웨이브 펌", name: "내추럴 롱 웨이브", english: "NATURAL LONG WAVE" },
  { src: "/assets/style-04.png", alt: "라벤더 애쉬 컬러", name: "라벤더 애쉬", english: "LAVENDER ASH" },
  { src: "/assets/style-05.png", alt: "다크 애쉬 허쉬컷", name: "다크 애쉬 허쉬컷", english: "DARK ASH HUSH CUT" },
  { src: "/assets/style-06.png", alt: "소프트 댄디 컷", name: "소프트 댄디", english: "SOFT DANDY CUT" },
  { src: "/assets/style-07.png", alt: "초콜릿 브라운 롱 레이어드", name: "초콜릿 브라운 레이어드", english: "CHOCOLATE BROWN LAYERED" },
  { src: "/assets/style-08.png", alt: "페이스라인 롱 레이어드", name: "페이스라인 레이어드", english: "FACE LINE LAYERED" },
  { src: "/assets/style-09.png", alt: "버건디 레이어드 컬러", name: "버건디 레이어드", english: "BURGUNDY LAYERED" },
  { src: "/assets/style-10.png", alt: "내추럴 미디엄 웨이브 펌", name: "내추럴 미디엄 웨이브", english: "NATURAL MEDIUM WAVE" },
  { src: "/assets/style-11.png", alt: "남성 소프트 리젠트 컷", name: "소프트 리젠트", english: "SOFT REGENT CUT" },
  { src: "/assets/style-12.png", alt: "브라운 롱 레이어드 C컬", name: "브라운 레이어드 C컬", english: "BROWN LAYERED C-CURL" },
];

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "https://favhair.kr";

  return {
    title: "FAV HAIR | 한 자리에서, 열일곱 해",
    description: "시간이 증명한 신뢰 위에 새롭게 시작하는 페이브 헤어. 평내호평 소정 대표원장과 민서 디자이너.",
    alternates: { canonical: origin },
    openGraph: {
      title: "FAV HAIR | 한 자리에서, 열일곱 해",
      description: "TIME BUILDS TRUST. 17년의 시간으로 증명한 페이브 헤어.",
      url: origin,
      siteName: "FAV HAIR",
      locale: "ko_KR",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "FAV HAIR — 한 자리에서, 열일곱 해" }],
    },
  };
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="FAV HAIR 홈">
          <img src="/assets/favhair-wordmark-transparent.png" alt="FAV HAIR" />
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a href="#story">Our story</a>
          <a href="#team">Artists</a>
          <a href="#style">Style</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="header-booking" href={BOOKING_URL} target="_blank" rel="noreferrer">
          예약하기 <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <img className="hero-image" src="/assets/salon-hero.jpg" alt="밝고 편안한 페이브 헤어 내부" />
        <div className="hero-wash" />
        <div className="silver-orbit silver-orbit-one" />
        <div className="silver-orbit silver-orbit-two" />
        <div className="hero-glow" />
        <div className="hero-copy">
          <p className="eyebrow">TIME BUILDS TRUST · FAV HAIR</p>
          <h1 id="hero-title">
            한 자리에서,
            <br />
            <em>열일곱 해.</em>
          </h1>
          <p className="hero-description">
            시간이 증명한 신뢰.
            <br />
            그 신뢰 위에 새롭게 시작하는 FAV HAIR.
          </p>
          <a className="hero-booking" href={BOOKING_URL} target="_blank" rel="noreferrer">
            네이버로 예약하기 <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="hero-note">PYEONGNAE · HOPYEONG</p>
        <a className="scroll-cue" href="#story" aria-label="브랜드 스토리로 이동">
          Scroll <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="trust-intro section-shell" id="story">
        <div className="section-label">
          <span>01</span>
          <p>TRUST, OVER TIME</p>
        </div>
        <div className="trust-copy">
          <p className="kicker">쉽게 생기고, 쉽게 사라지는 것들 사이에서</p>
          <h2>
            오래 머문다는 것은
            <br />
            매일의 <em>신뢰</em>를 쌓는 일.
          </h2>
          <p className="body-copy">
            한 자리에서 디자이너로 시작해 대표가 되기까지. 소정 원장은 17년 동안 같은 공간에서
            고객의 계절과 취향을 기억해왔습니다. 페이브는 그 오랜 관계 위에서 시작한 새로운 이름입니다.
          </p>
        </div>
      </section>

      <section className="trust-numbers" aria-label="페이브의 신뢰를 보여주는 숫자">
        <a className="trust-number-link" href="#owner-story" aria-label="17년의 브랜드 이야기 보기">
          <strong>17</strong>
          <span>YEARS</span>
          <p>한 자리에서 쌓아온 시간</p>
          <small>이야기 보기 <b aria-hidden="true">↘</b></small>
        </a>
        <a className="trust-number-link" href="#space" aria-label="페이브 헤어 공간 보기">
          <strong>01</strong>
          <span>PLACE</span>
          <p>변하지 않고 지켜온 자리</p>
          <small>공간 보기 <b aria-hidden="true">↘</b></small>
        </a>
        <a className="trust-number-link" href="#reviews" aria-label="고객 후기 보기">
          <strong>∞</strong>
          <span>RETURN</span>
          <p>다시 찾고 싶은 편안함</p>
          <small>고객 후기 <b aria-hidden="true">↘</b></small>
        </a>
      </section>

      <section className="letter-section section-shell" id="owner-story">
        <div className="letter-image-wrap">
          <img src="/assets/sojeong.jpeg" alt="페이브 헤어 대표원장 소정" loading="lazy" />
          <span className="portrait-caption">SOJEONG · OWNER DIRECTOR</span>
        </div>
        <div className="letter-copy">
          <div className="section-label compact">
            <span>02</span>
            <p>LETTER FROM THE OWNER</p>
          </div>
          <p className="letter-lead">“새로운 이름 안에도, 오래 지켜온 마음을 담았습니다.”</p>
          <div className="letter-body">
            <p>
              17년 동안 같은 자리에서 수많은 계절과 얼굴을 만났습니다. 처음에는 잘하고 싶은
              디자이너였고, 지금은 오래 믿고 찾아주신 마음에 답하고 싶은 대표가 되었습니다.
            </p>
            <p>
              페이브는 새로운 이름이지만, 우리가 지켜온 태도는 달라지지 않습니다. 서두르지 않고
              충분히 듣는 것, 한 번의 유행보다 오래 어울리는 아름다움을 찾는 것.
            </p>
            <p>
              머리를 맡기는 시간이 편안한 신뢰로 남도록, 오늘도 같은 자리에서 기다리겠습니다.
            </p>
          </div>
          <div className="signature">
            <span>대표원장</span>
            <strong>소정</strong>
          </div>
        </div>
      </section>

      <section className="team-section" id="team">
        <div className="section-shell team-heading">
          <div className="section-label">
            <span>03</span>
            <p>MEET THE ARTISTS</p>
          </div>
          <h2>당신의 시간을 이해하는 사람들</h2>
        </div>
        <div className="team-grid">
          <article className="team-card">
            <div className="team-photo">
              <img src="/assets/sojeong.jpeg" alt="대표원장 소정" loading="lazy" />
            </div>
            <div className="team-meta">
              <div>
                <p>OWNER DIRECTOR</p>
                <h3>소정</h3>
              </div>
              <span>17 YEARS · ONE PLACE</span>
            </div>
            <p className="team-description">오래 보아야 알 수 있는 취향까지 기억하고, 자연스럽게 오래가는 스타일을 제안합니다.</p>
            <a className="text-link" href={BOOKING_URL} target="_blank" rel="noreferrer">소정 원장 예약 ↗</a>
          </article>
          <article className="team-card">
            <div className="team-photo minseo-photo">
              <img src="/assets/minseo.jpeg" alt="디자이너 민서" loading="lazy" />
            </div>
            <div className="team-meta">
              <div>
                <p>HAIR DESIGNER</p>
                <h3>민서</h3>
              </div>
              <span>FAV HAIR ARTIST</span>
            </div>
            <p className="team-description">고객의 분위기와 일상에 섬세하게 어울리는, 편안하고 감각적인 디자인을 함께 찾습니다.</p>
            <a className="text-link" href={BOOKING_URL} target="_blank" rel="noreferrer">민서 디자이너 예약 ↗</a>
          </article>
        </div>
      </section>

      <section className="style-section section-shell" id="style">
        <div className="style-heading">
          <div className="section-label">
            <span>04</span>
            <p>OUR STYLE</p>
          </div>
          <div>
            <h2>Natural, with intention.</h2>
            <p>과하지 않게, 당신다운 결을 살리는 디자인.</p>
          </div>
        </div>
        <div className="style-grid">
          {styles.slice(0, 6).map((item, index) => (
            <figure key={item.src} className={`style-item style-${index + 1}`}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>
                <span>{item.name}</span>
                <small>{item.english} · {String(index + 1).padStart(2, "0")}</small>
              </figcaption>
            </figure>
          ))}
        </div>
        <details className="style-more">
          <summary>
            <span>MORE STYLES</span>
            <small>스타일 더 보기</small>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="style-more-grid">
            {styles.slice(6).map((item, index) => (
              <figure key={item.src} className="style-item style-more-item">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>
                  <span>{item.name}</span>
                  <small>{item.english} · {String(index + 7).padStart(2, "0")}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </details>
      </section>

      <section className="space-section" id="space">
        <div className="space-image">
          <img src="/assets/interior-02.png" alt="창가와 거울 조명이 어우러진 페이브 헤어 공간" loading="lazy" />
        </div>
        <div className="space-panel">
          <div className="section-label compact light-label">
            <span>05</span>
            <p>OUR SPACE</p>
          </div>
          <p className="space-kicker">A ROOM FOR YOUR OWN PACE</p>
          <h2>빛과 여백이<br />머무는 곳.</h2>
          <p className="space-description">환한 창가와 차분한 거울 앞에서, 서두르지 않고 당신의 이야기에 집중합니다.</p>
          <div className="space-details">
            <span>NATURAL LIGHT</span>
            <span>CALM &amp; PRIVATE</span>
          </div>
          <div className="space-actions">
            <a href="#space-gallery">공간 더 보기 <span aria-hidden="true">↓</span></a>
            <a href="#visit">오시는 길 <span aria-hidden="true">↘</span></a>
          </div>
        </div>
      </section>

      <section className="space-gallery section-shell" id="space-gallery" aria-label="페이브 헤어 공간 사진">
        <div className="space-gallery-heading">
          <p>THE SPACE, IN DETAIL</p>
          <span>옆으로 넘겨 공간을 둘러보세요</span>
        </div>
        <div className="space-gallery-track">
          <figure>
            <img src="/assets/interior-03.png" alt="페이브 헤어의 차분한 시술 공간" loading="lazy" />
            <figcaption>01 · STYLING AREA</figcaption>
          </figure>
          <figure>
            <img src="/assets/salon-detail.jpg" alt="페이브 헤어의 조명과 거울 디테일" loading="lazy" />
            <figcaption>02 · LIGHT &amp; MIRROR</figcaption>
          </figure>
          <figure>
            <img src="/assets/interior-01.png" alt="자연광이 들어오는 페이브 헤어 내부" loading="lazy" />
            <figcaption>03 · NATURAL LIGHT</figcaption>
          </figure>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="section-shell reviews-inner">
          <div className="section-label light-label">
            <span>06</span>
            <p>CUSTOMER REVIEWS</p>
          </div>
          <div className="reviews-heading">
            <p>TRUST, IN THEIR WORDS</p>
            <h2>다시 찾는 이유는<br />고객의 이야기에 남습니다.</h2>
          </div>
          <div className="review-promises" aria-label="페이브 헤어가 중요하게 생각하는 고객 경험">
            <article>
              <span>01</span>
              <h3>오래 기억하는 상담</h3>
              <p>얼굴형과 취향, 평소 손질 습관까지 충분히 듣고 제안합니다.</p>
            </article>
            <article>
              <span>02</span>
              <h3>일상까지 편한 디자인</h3>
              <p>매장을 나선 뒤에도 자연스럽게 손질되는 스타일을 생각합니다.</p>
            </article>
            <article>
              <span>03</span>
              <h3>다시 찾고 싶은 시간</h3>
              <p>서두르지 않는 시술과 편안한 대화로 오래 남을 경험을 만듭니다.</p>
            </article>
          </div>
          <a className="review-link" href={REVIEW_URL} target="_blank" rel="noreferrer">
            <span>
              <small>NAVER PLACE</small>
              실제 고객후기 모두 보기
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>
      </section>

      <section className="recruit-section section-shell" id="recruit">
        <div className="recruit-copy">
          <div className="section-label">
            <span>07</span>
            <p>JOIN OUR TEAM</p>
          </div>
          <p className="recruit-kicker">GROW WITH FAV HAIR</p>
          <h2>좋은 디자이너는<br />좋은 환경에서 더 빛납니다.</h2>
          <p className="recruit-description">
            페이브는 단순히 직원을 찾는 것이 아니라, 고객 한 분 한 분에게 집중하며 오랫동안 함께 성장할 동료를 기다립니다.
          </p>
          <ul>
            <li>함께 배우고 성장하는 것을 즐기는 분</li>
            <li>장기적으로 함께 성장할 수 있는 시스템</li>
            <li>서로 존중하는 따뜻한 근무 환경</li>
          </ul>
          <div className="recruit-actions">
            <a href={KAKAO_URL} target="_blank" rel="noreferrer">카카오로 지원하기 ↗</a>
            <a href="sms:010-2563-4639">문자로 지원하기 ↗</a>
          </div>
        </div>
        <div className="recruit-image">
          <img src="/assets/interior-03.png" alt="함께 성장할 디자이너를 기다리는 페이브 헤어" loading="lazy" />
          <p><span>POSITION</span> HAIR DESIGNER</p>
        </div>
      </section>

      <section className="visit-section section-shell" id="visit">
        <div className="visit-intro">
          <div className="section-label">
            <span>08</span>
            <p>VISIT FAV</p>
          </div>
          <h2>오래 알고 지낸 듯,<br />편안하게 만나겠습니다.</h2>
        </div>
        <div className="visit-grid">
          <article>
            <p className="visit-label">ADDRESS</p>
            <p>경기 남양주시 늘을2로 26<br />메인시네마타워 203-1호</p>
            <p className="visit-note">평내호평역 1번 출구에서 254m</p>
            <div className="link-row">
              <a href="https://naver.me/xTsec6Zh" target="_blank" rel="noreferrer">네이버 지도 ↗</a>
              <a href="https://kko.to/m-lv-U-bkt" target="_blank" rel="noreferrer">카카오맵 ↗</a>
            </div>
          </article>
          <article>
            <p className="visit-label">OPENING HOURS</p>
            <p>매일 10:00 — 19:00</p>
            <p className="visit-note">주차는 건물 뒤편 일방통행 진입 후<br />오른쪽 첫 번째 건물 주차장을 이용해주세요.</p>
          </article>
          <article>
            <p className="visit-label">CONTACT</p>
            <a className="phone-number" href="tel:031-511-7345">031. 511. 7345</a>
            <div className="link-row stacked">
              <a href={KAKAO_URL} target="_blank" rel="noreferrer">카카오 문의 ↗</a>
              <a href="sms:01025634639">문자 문의 ↗</a>
            </div>
          </article>
        </div>
        <a className="booking-banner" href={BOOKING_URL} target="_blank" rel="noreferrer">
          <span>
            <small>ONLINE RESERVATION</small>
            지금, 나에게 어울리는 시간을 예약하세요.
          </span>
          <strong aria-hidden="true">↗</strong>
        </a>
      </section>

      <footer>
        <div className="footer-mark">FAV HAIR</div>
        <p>TIME BUILDS TRUST.</p>
        <div className="footer-bottom">
          <span>© 2026 FAV HAIR</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      <nav className="mobile-actions" aria-label="빠른 메뉴">
        <a href="tel:031-511-7345">전화</a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer">네이버 예약</a>
      </nav>
    </main>
  );
}

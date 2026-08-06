"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured, publicImageUrl } from "../lib/supabase-config";
import type { PhotoRow } from "../lib/supabase";

export type StyleItem = {
  src: string;
  alt: string;
  name: string;
  english: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function StyleGallery({ styles }: { styles: StyleItem[] }) {
  const [items, setItems] = useState<StyleItem[]>(styles);
  const [fromSupabase, setFromSupabase] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;

    (async () => {
      try {
        const { getSupabase } = await import("../lib/supabase");
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("photos")
          .select("id,title,subtitle,storage_path,sort_order,created_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!alive || error || !data || data.length === 0) return;

        const rows = data as PhotoRow[];
        setItems(
          rows.map((row) => ({
            src: publicImageUrl(row.storage_path),
            alt: row.title?.trim() || "페이브헤어 스타일 사진",
            name: row.title?.trim() || "",
            english: row.subtitle?.trim() || "",
          })),
        );
        setFromSupabase(true);
      } catch {
        // 실패하면 기존 정적 사진을 그대로 보여줍니다.
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const featured = items.slice(0, 6);
  const rest = items.slice(6);

  return (
    <>
      <div className="style-feed-bar" aria-label="페이브헤어 시그니처 룩북">
        <span className="feed-avatar">F</span>
        <span className="feed-account"><strong>@FAVHAIR.LOOKS</strong><small>PYEONGNAE · HOPYEONG</small></span>
        <span className="feed-count">{`01 — ${pad(featured.length)}`}</span>
      </div>
      <div className="style-grid">
        {featured.map((item, index) => (
          <figure key={item.src} className={`style-item style-${index + 1}`}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            {!fromSupabase && (index === 3 || index === 5) && <span className="style-brand-fix" aria-hidden="true">FAVHAIR</span>}
            <figcaption>
              <span>{item.name}</span>
              <small><em>{item.english}</em><b>· {pad(index + 1)}</b></small>
            </figcaption>
          </figure>
        ))}
      </div>
      {rest.length > 0 && (
        <details className="style-more">
          <summary>
            <span>MORE STYLES</span>
            <small>스타일 더 보기</small>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="style-more-grid">
            {rest.map((item, index) => (
              <figure key={item.src} className="style-item style-more-item">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>
                  <span>{item.name}</span>
                  <small><em>{item.english}</em><b>· {pad(index + 7)}</b></small>
                </figcaption>
              </figure>
            ))}
          </div>
        </details>
      )}
    </>
  );
}
